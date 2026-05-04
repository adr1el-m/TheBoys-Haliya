import type { Request, Response } from "express";
import Groq from "groq-sdk";
import crypto from "crypto";
import { env } from "../configs/envalid.js";
import { db } from "../configs/db.js";
import { triageSessions } from "./triageController.js";
import { pgTable, text, real, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql, eq, desc, gte } from "drizzle-orm";
import { tryCatch } from "../utils/tryCatch.js";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

// Temporary model for OutbreakAlert
export const outbreakAlerts = pgTable("outbreak_alerts", {
  id: varchar("id").primaryKey().notNull(),
  symptom_cluster: varchar("symptom_cluster"),
  region: varchar("region"),
  spike_percentage: real("spike_percentage"),
  severity: varchar("severity"),
  message: text("message"),
  created_at: timestamp("created_at").defaultNow(),
});

export const getDashboardSummary = async (req: Request, res: Response) => {
  const result = await tryCatch(
    db.select({ 
      count: sql`count(*)`,
      avg_urgency: sql`avg(urgency_score)`
    }).from(triageSessions)
  );

  if (result.error || !result.data) {
    return res.status(500).json({ message: "Failed to fetch stats", error: String(result.error) });
  }

  // Get most affected region
  const regionResult = await db.select({ 
    region: triageSessions.region,
    count: sql`count(*)`
  }).from(triageSessions).groupBy(triageSessions.region).orderBy(desc(sql`count(*)`)).limit(1);

  // Get active alerts count
  const alertsCount = await db.select({ count: sql`count(*)` }).from(outbreakAlerts);

  res.json({
    total_reports_today: Number(result.data![0]!.count),
    avg_urgency_score: Number(result.data![0]!.avg_urgency || 0).toFixed(1),
    most_affected_region: regionResult[0]?.region || "None",
    active_alerts: Number(alertsCount[0]?.count || 0)
  });
};

export const getRegionalStats = async (req: Request, res: Response) => {
  const result = await tryCatch(
    db.select({
      region: triageSessions.region,
      report_count: sql`count(*)`,
      avg_urgency: sql`avg(urgency_score)`
    })
    .from(triageSessions)
    .groupBy(triageSessions.region)
  );

  if (result.error || !result.data) {
    return res.status(500).json({ message: "Failed to fetch regional stats", error: String(result.error) });
  }

  const data = result.data.map(r => ({
    region: r.region || "Unknown",
    report_count: Number(r.report_count),
    avg_urgency: Number(r.avg_urgency || 0).toFixed(1)
  }));

  res.json(data);
};

export const getTrends = async (req: Request, res: Response) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const result = await tryCatch(
    db.select({
      date: sql`DATE(created_at)`,
      count: sql`count(*)`
    })
    .from(triageSessions)
    .where(gte(triageSessions.created_at, sevenDaysAgo))
    .groupBy(sql`DATE(created_at)`)
    .orderBy(sql`DATE(created_at)`)
  );

  if (result.error || !result.data) {
    return res.status(500).json({ message: "Failed to fetch trends", error: String(result.error) });
  }

  const data = result.data.map(r => ({
    date: r.date,
    count: Number(r.count)
  }));

  res.json(data);
};

// Generate AI-powered outbreak alerts based on symptom clusters
export const generateIntelligence = async (req: Request, res: Response) => {
  // 1. Fetch recent sessions (last 48 hours)
  const fortyEightHoursAgo = new Date();
  fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

  const sessions = await db.select({
    region: triageSessions.region,
    symptoms: triageSessions.symptoms_raw,
    urgency: triageSessions.urgency_score
  })
  .from(triageSessions)
  .where(gte(triageSessions.created_at, fortyEightHoursAgo));

  if (sessions.length < 5) {
    return res.json({ message: "Insufficient data for AI analysis", alerts_generated: 0 });
  }

  // 2. Group by region
  const regionalData: Record<string, string[]> = {};
  sessions.forEach(s => {
    const reg = s.region || "Unknown";
    if (!regionalData[reg]) regionalData[reg] = [];
    regionalData[reg].push(s.symptoms || "");
  });

  let alertsGenerated = 0;

  // 3. For each region with significant data, ask Groq to find patterns
  for (const [region, symptomList] of Object.entries(regionalData)) {
    if (symptomList.length < 3) continue; // Skip regions with low data

    const prompt = `
      Analyze these ${symptomList.length} medical symptom reports from the region of ${region}:
      ${symptomList.join('\n- ')}

      Identify if there is a semantic cluster or potential disease outbreak (e.g., many people reporting similar flu-like symptoms, stomach issues, etc).
      
      Respond strictly in JSON format:
      {
        "outbreak_detected": boolean,
        "symptom_cluster": "e.g., Respiratory Virus, Food Poisoning",
        "severity": "watch" | "alert" | "warning",
        "spike_percentage": number (estimated percentage increase in similarity),
        "message": "Clear, actionable public health warning message"
      }
    `;

    const completion = await tryCatch(
      groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      })
    );

    if (completion.data) {
      const result = JSON.parse(completion.data.choices[0]!.message.content || "{}");
      
      if (result.outbreak_detected) {
        await db.insert(outbreakAlerts).values({
          id: crypto.randomUUID(),
          region,
          symptom_cluster: result.symptom_cluster,
          spike_percentage: result.spike_percentage,
          severity: result.severity,
          message: result.message
        });
        alertsGenerated++;
      }
    }
  }

  res.json({ 
    message: `Intelligence analysis complete. ${alertsGenerated} outbreak alerts generated.`,
    alerts_generated: alertsGenerated 
  });
};

export const getAlerts = async (req: Request, res: Response) => {
  // If no alerts, try to generate some (for demo purposes)
  const existingAlerts = await db.select().from(outbreakAlerts);
  
  if (existingAlerts.length === 0) {
    // We'll call generateIntelligence internally or just return empty for now
    // In a real app, this would be a CRON job
  }

  const result = await tryCatch(
    db.select().from(outbreakAlerts).orderBy(desc(outbreakAlerts.created_at)).limit(5)
  );

  if (result.error || !result.data) {
    return res.status(500).json({ message: "Failed to fetch alerts", error: String(result.error) });
  }

  res.json(result.data);
};
