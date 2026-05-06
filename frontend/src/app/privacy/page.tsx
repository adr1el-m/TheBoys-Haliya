'use client';

import AppHeader from '@/components/AppHeader';
import { mainNavItems } from '@/lib/navigation';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <AppHeader navItems={[...mainNavItems]} />
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900">Data Privacy Policy</h1>
          <p className="mt-3 text-slate-500">
            This policy explains how Haliya collects, uses, and protects your information.
          </p>

          <div className="mt-8 space-y-6 text-sm text-slate-600">
            <div>
              <h2 className="text-base font-bold text-slate-800">Information We Collect</h2>
              <p className="mt-2">
                We collect information you provide during triage, registration, and profile updates (such as symptoms, age, and health history). We also collect technical data needed to operate the service securely.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800">How We Use Your Data</h2>
              <p className="mt-2">
                We use your data to provide triage results, power your dashboard, and improve health insights. Aggregated data may be used for public health trends without identifying you personally.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800">Data Retention</h2>
              <p className="mt-2">
                We retain data only as long as necessary to provide the service or as required by law. You may request deletion of your account data.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800">Security</h2>
              <p className="mt-2">
                We apply technical and organizational safeguards to protect your data. No system is 100% secure, so please use the service responsibly.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800">Contact</h2>
              <p className="mt-2">
                For privacy questions or requests, contact the Haliya team.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
