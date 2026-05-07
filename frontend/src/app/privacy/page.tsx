'use client';

import AppHeader from '@/components/AppHeader';
import { mainNavItems } from '@/lib/navigation';
import { Database, FileText, LockKeyhole, ShieldCheck, Trash2, Users } from 'lucide-react';

const policySections = [
  {
    title: 'Information We Collect',
    icon: Database,
    body: 'Haliya collects account information, patient or facility profile details, symptom assessments, appointment records, device/session identifiers, and technical security logs needed to operate the service. Health-related entries may be sensitive personal information under the Philippine Data Privacy Act of 2012.',
  },
  {
    title: 'How We Use Information',
    icon: FileText,
    body: 'We use information to provide AI-assisted triage, appointment routing, patient and facility dashboards, safety auditing, fraud prevention, service reliability, and public-health intelligence. Haliya does not sell personal health information.',
  },
  {
    title: 'Anonymization and Public Health Use',
    icon: Users,
    body: 'Before data is used for trend dashboards, outbreak signals, research summaries, or public-health reporting, Haliya minimizes and aggregates records and may anonymize or de-identify them so the output does not reasonably identify a patient. Aggregated statistics may be retained for institutional reporting and community health monitoring.',
  },
  {
    title: 'Security and Access Controls',
    icon: LockKeyhole,
    body: 'We apply role-based access controls, encrypted transport, authenticated sessions, audit-friendly clinical records, and operational safeguards. Facility users should only access cases assigned to their facility and must protect their credentials.',
  },
  {
    title: 'Your Rights and Choices',
    icon: ShieldCheck,
    body: 'You may request access, correction, portability where technically feasible, objection to certain processing, withdrawal of consent where applicable, and deletion of account-linked personal data. Patients and facilities can initiate account deletion from their profile page.',
  },
  {
    title: 'Deletion Requests',
    icon: Trash2,
    body: 'When you delete your account, we remove your account profile, linked appointments, and device triage history when the session token is available. We may retain anonymized statistics, security logs, or records required by law, dispute resolution, audits, or public-interest health reporting.',
  },
];

const retentionRows = [
  ['Account and profile records', 'For the life of the account, then deleted or anonymized after account deletion unless retention is legally required.'],
  ['Appointments and facility queue records', 'Retained while needed for care coordination, facility audit, dispute handling, or legal compliance; deleted with account-linked records when permitted.'],
  ['Symptom triage history', 'Stored by session token for continuity and trend summaries; users may delete it with their account or by clearing device history where available.'],
  ['Aggregated public-health indicators', 'Retained as anonymized or de-identified statistical records for longitudinal public-health intelligence.'],
  ['Security and operational logs', 'Normally retained for up to 12 months unless an incident, investigation, or legal obligation requires longer retention.'],
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <AppHeader navItems={[...mainNavItems]} />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="space-y-6">
            <div className="rounded-3xl border border-teal-100 bg-white p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-teal-700">
                <ShieldCheck size={14} />
                Institutional Privacy Notice
              </div>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950">Data Privacy Policy</h1>
              <p className="mt-4 text-sm font-semibold text-slate-500">Effective date: May 7, 2026</p>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                Haliya is designed for patients, health facilities, and public-health teams in the Philippines. This policy explains how we collect, use, protect, anonymize, retain, and delete information handled through the platform.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Privacy Office</p>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-600">
                Privacy requests may be sent to the Haliya privacy team through the official support channel provided by the institution operating this deployment.
              </p>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {policySections.map(({ title, body, icon: Icon }) => (
                <article key={title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Icon size={21} />
                  </div>
                  <h2 className="text-lg font-black text-slate-900">{title}</h2>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">{body}</p>
                </article>
              ))}
            </div>

            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">Retention Schedule</h2>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      <th className="pb-3 pr-4">Record Type</th>
                      <th className="pb-3">Retention Approach</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {retentionRows.map(([record, retention]) => (
                      <tr key={record}>
                        <td className="py-4 pr-4 font-black text-slate-800">{record}</td>
                        <td className="py-4 font-medium leading-relaxed text-slate-600">{retention}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
