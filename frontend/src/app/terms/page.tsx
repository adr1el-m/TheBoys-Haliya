'use client';

import AppHeader from '@/components/AppHeader';
import { mainNavItems } from '@/lib/navigation';
import { AlertTriangle, ClipboardCheck, HeartPulse, Scale, ShieldCheck, Trash2 } from 'lucide-react';

const terms = [
  {
    title: 'Decision Support, Not Diagnosis',
    icon: HeartPulse,
    body: 'Haliya provides AI-assisted triage and care-navigation support. It is not a physician, hospital, emergency service, diagnosis, prescription, or substitute for professional medical judgment.',
  },
  {
    title: 'Emergency Use',
    icon: AlertTriangle,
    body: 'If you may be experiencing a medical emergency, call local emergency services or proceed to the nearest emergency room. Do not wait for Haliya, a facility response, or an appointment confirmation.',
  },
  {
    title: 'User Responsibilities',
    icon: ClipboardCheck,
    body: 'You agree to provide accurate information, update material health or facility details, use the platform lawfully, protect account credentials, and avoid submitting misleading, abusive, or unauthorized information.',
  },
  {
    title: 'Institutional and Facility Use',
    icon: ShieldCheck,
    body: 'Facility and institutional users must access only records they are authorized to handle, use queue and triage data for legitimate care coordination, and comply with applicable privacy, medical, and professional obligations.',
  },
  {
    title: 'Data, Anonymization, and Account Deletion',
    icon: Trash2,
    body: 'By using Haliya, you consent to processing needed to operate the service. Account-linked data may be deleted from profile settings. Aggregated or anonymized public-health indicators may remain because they no longer identify a person.',
  },
  {
    title: 'Service Changes and Limits',
    icon: Scale,
    body: 'Haliya may update models, workflows, policies, or features to improve safety and reliability. We aim for high availability, but the service may be unavailable during maintenance, connectivity issues, or third-party outages.',
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <AppHeader navItems={[...mainNavItems]} />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
                <Scale size={14} />
                Institutional Terms of Use
              </div>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950">Terms and Conditions</h1>
              <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-slate-600">
                These terms govern access to Haliya by patients, facility users, administrators, and public-health stakeholders. By registering, logging in, or using the platform, you agree to these terms and the Data Privacy Policy.
              </p>
            </div>
            <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500">Effective date: May 7, 2026</p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {terms.map(({ title, body, icon: Icon }) => (
            <article key={title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Icon size={21} />
              </div>
              <h2 className="text-lg font-black text-slate-900">{title}</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">{body}</p>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Additional Conditions</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <p className="text-sm font-medium leading-relaxed text-slate-600">
              AI outputs may be incomplete or incorrect when information is missing, symptoms are ambiguous, systems are unavailable, or clinical circumstances change. Haliya includes safety rules and audit signals, but final clinical decisions belong to qualified professionals.
            </p>
            <p className="text-sm font-medium leading-relaxed text-slate-600">
              We may suspend access for misuse, unauthorized access attempts, privacy violations, abuse of facility queues, or behavior that could harm patients, facilities, or the integrity of public-health monitoring.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
