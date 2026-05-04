import { randomUUID } from "crypto";
import { eq, desc, or, sql } from "drizzle-orm";
import type { Request, Response } from "express";
import { db, pool } from "../configs/db.js";
import {
  appointments,
  createAppointmentSchema,
  updateAppointmentSchema,
  type NewAppointment,
} from "../models/appointmentModel.js";
import { tryCatch } from "../utils/tryCatch.js";
import { patients } from "../models/patientModel.js";
import { facilities } from "../models/facilityModel.js";

export const getAllAppointments = async (req: Request, res: Response) => {
  const allAppointments = await tryCatch(
    db.select().from(appointments),
  );
  if (allAppointments.error) return res.status(500).json({ message: "Failed to get appointments" });
  res.json(allAppointments.data);
};

export const getAppointment = async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  const appointment = await tryCatch(
    db.select().from(appointments).where(eq(appointments.id, id)),
  );
  if (appointment.error || !appointment.data?.[0]) return res.status(404).json({ message: "Not found" });
  res.json(appointment.data[0]);
};

export const createAppointment = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    let patientId = req.body.patient_id;
    if (!patientId && user.role === "patient") {
      const p = await db.select({ id: patients.id }).from(patients).where(eq(patients.user_id, user.id)).limit(1);
      if (p[0]) patientId = p[0].id;
    }

    const facilityId = req.body.facility_id;
    const appointmentDate = req.body.appointment_date;
    const symptomsSummary = req.body.symptoms_summary || '';
    const triageScore = req.body.triage_score || null;
    const triageExplanation = req.body.triage_explanation || null;
    const apptId = randomUUID();

    if (!patientId || !facilityId) {
      return res.status(400).json({ message: "patient_id and facility_id are required" });
    }

    const result = await pool.query(
      `INSERT INTO appointments (id, patient_id, facility_id, appointment_date, status, symptoms_summary, triage_score, triage_explanation, data, created_at, updated_at)
       VALUES ($1::uuid, $2::uuid, $3::uuid, $4, 'pending', $5, $6, $7, '{}'::jsonb, NOW(), NOW())
       RETURNING *`,
      [apptId, patientId, facilityId, appointmentDate, symptomsSummary, triageScore, triageExplanation]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createAppointment error:", err);
    res.status(500).json({ message: "Failed to create appointment", detail: String(err) });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.query;
  const updated = await tryCatch(
    db.update(appointments).set({ status: status as any }).where(eq(appointments.id, id as string)).returning()
  );
  if (updated.error) return res.status(500).json({ message: "Failed to update" });
  res.json(updated.data[0]);
};

export const getMyAppointments = async (req: Request, res: Response) => {
  const user = (req as any).user; 
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    let profileId = "";
    if (user.role === "patient") {
      const p = await db.select({ id: patients.id }).from(patients).where(eq(patients.user_id, user.id)).limit(1);
      if (p[0]) profileId = p[0].id;
    } else {
      const f = await db.select({ id: facilities.id }).from(facilities).where(eq(facilities.user_id, user.id)).limit(1);
      if (f[0]) profileId = f[0].id;
    }

    if (!profileId) return res.json([]); 

    // Use raw pg pool to avoid Drizzle ORM type casting issues with uuid
    const myAppts = await pool.query(
      `SELECT id, patient_id, facility_id, appointment_date, status, symptoms_summary, triage_score, triage_explanation 
       FROM appointments 
       WHERE patient_id = $1::uuid OR facility_id = $1::uuid 
       ORDER BY appointment_date DESC`,
      [profileId]
    );

    // Enrich with names, with null safety
    const enriched = await Promise.all((myAppts.rows as any[]).map(async (appt: any) => {
      let patientName = "Unknown Patient";
      let facilityName = "Unknown Facility";

      if (appt.patient_id) {
        const p = await db.select({ name: patients.full_name }).from(patients).where(eq(patients.id, appt.patient_id)).limit(1);
        if (p[0]?.name) patientName = p[0].name;
      }
      if (appt.facility_id) {
        const f = await db.select({ name: facilities.name }).from(facilities).where(eq(facilities.id, appt.facility_id)).limit(1);
        if (f[0]?.name) facilityName = f[0].name;
      }
      
      return {
        ...appt,
        patient_name: patientName,
        facility_name: facilityName
      };
    }));

    res.json(enriched);
  } catch (err) {
    console.error("getMyAppointments error:", err);
    res.status(500).json({ message: "Error fetching appointments", detail: String(err) });
  }
};

export const getFacilities = async (req: Request, res: Response) => {
  const result = await tryCatch(db.select().from(facilities));
  if (result.error) return res.status(500).json({ message: "Error" });
  res.json(result.data);
};
