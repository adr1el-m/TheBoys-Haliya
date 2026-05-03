import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../configs/db.js";
import {
  appointments,
  createAppointmentSchema,
  updateAppointmentSchema,
  type NewAppointment,
} from "../models/appointmentModel.js";
import { tryCatch } from "../utils/tryCatch.js";

export const getAllAppointments = async (req: Request, res: Response) => {
  const allAppointments = await tryCatch(
    db
      .select({
        id: appointments.id,
        patient_id: appointments.patient_id,
        facility_id: appointments.facility_id,
        doctor_name: appointments.doctor_name,
        specialty: appointments.specialty,
        appointment_type: appointments.appointment_type,
        appointment_date: appointments.appointment_date,
        appointment_time: appointments.appointment_time,
        status: appointments.status,
        notes: appointments.notes,
        data: appointments.data,
        created_at: appointments.created_at,
        updated_at: appointments.updated_at,
      })
      .from(appointments),
  );

  if (allAppointments.error) {
    return res
      .status(500)
      .json({ message: "Failed to get all appointments", isError: true });
  }

  res.json(allAppointments.data);
};

export const getAppointment = async (req: Request, res: Response) => {
  const id = req.params["id"] as string;

  if (!id) {
    return res
      .status(400)
      .json({ message: "Appointment ID is required", isError: true });
  }

  const appointment = await tryCatch(
    db
      .select({
        id: appointments.id,
        patient_id: appointments.patient_id,
        facility_id: appointments.facility_id,
        doctor_name: appointments.doctor_name,
        specialty: appointments.specialty,
        appointment_type: appointments.appointment_type,
        appointment_date: appointments.appointment_date,
        appointment_time: appointments.appointment_time,
        status: appointments.status,
        notes: appointments.notes,
        data: appointments.data,
        created_at: appointments.created_at,
        updated_at: appointments.updated_at,
      })
      .from(appointments)
      .where(eq(appointments.id, id)),
  );

  if (appointment.error) {
    return res
      .status(500)
      .json({ message: "Failed to get appointment", isError: true });
  }

  if (!appointment.data || appointment.data.length === 0) {
    return res
      .status(404)
      .json({ message: "Appointment not found", isError: true });
  }

  res.json(appointment.data[0]);
};

export const createAppointment = async (req: Request, res: Response) => {
  const parsed = createAppointmentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: parsed.error.issues, isError: true });
  }

  const {
    patient_id,
    facility_id,
    doctor_name,
    specialty,
    appointment_type,
    appointment_date,
    appointment_time,
    status,
    notes,
    data,
  } = parsed.data;

  const newAppointment: NewAppointment = {
    id: randomUUID(),
    patient_id,
    facility_id,
    doctor_name,
    specialty,
    appointment_type,
    appointment_date,
    appointment_time,
    status,
    notes,
    data: data ?? {},
  };

  const created = await tryCatch(
    db.insert(appointments).values(newAppointment).returning(),
  );

  if (created.error) {
    return res
      .status(500)
      .json({ message: "Failed to create appointment", isError: true });
  }

  res.status(201).json(created.data);
};

export const updateAppointment = async (req: Request, res: Response) => {
  const id = req.params["id"] as string;

  if (!id) {
    return res
      .status(400)
      .json({ message: "Appointment ID is required", isError: true });
  }

  const parsed = updateAppointmentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: parsed.error.issues, isError: true });
  }

  const updates: Partial<NewAppointment> = {};
  const data = parsed.data;

  if (data.doctor_name !== undefined) updates.doctor_name = data.doctor_name;
  if (data.specialty !== undefined) updates.specialty = data.specialty;
  if (data.appointment_type !== undefined)
    updates.appointment_type = data.appointment_type;
  if (data.appointment_date !== undefined)
    updates.appointment_date = data.appointment_date;
  if (data.appointment_time !== undefined)
    updates.appointment_time = data.appointment_time;
  if (data.status !== undefined) updates.status = data.status;
  if (data.notes !== undefined) updates.notes = data.notes;
  if (data.data !== undefined) updates.data = data.data;

  if (Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ message: "No fields to update", isError: true });
  }

  const updated = await tryCatch(
    db
      .update(appointments)
      .set(updates)
      .where(eq(appointments.id, id))
      .returning(),
  );

  if (updated.error) {
    return res
      .status(500)
      .json({ message: "Failed to update appointment", isError: true });
  }

  if (!updated.data || updated.data.length === 0) {
    return res
      .status(404)
      .json({ message: "Appointment not found", isError: true });
  }

  res.json(updated.data);
};
