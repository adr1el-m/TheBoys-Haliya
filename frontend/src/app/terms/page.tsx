'use client';

import AppHeader from '@/components/AppHeader';
import { mainNavItems } from '@/lib/navigation';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <AppHeader navItems={[...mainNavItems]} />
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900">Terms and Conditions</h1>
          <p className="mt-3 text-slate-500">
            By using Haliya, you agree to the following terms.
          </p>

          <div className="mt-8 space-y-6 text-sm text-slate-600">
            <div>
              <h2 className="text-base font-bold text-slate-800">Not Medical Advice</h2>
              <p className="mt-2">
                Haliya provides AI-assisted triage guidance for informational purposes only. It does not replace professional medical advice, diagnosis, or treatment.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800">User Responsibility</h2>
              <p className="mt-2">
                You are responsible for the accuracy of the information you provide and for seeking professional care when needed.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800">Account and Security</h2>
              <p className="mt-2">
                Keep your account credentials secure. You are responsible for all activity under your account.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800">Acceptable Use</h2>
              <p className="mt-2">
                Do not misuse the service, attempt unauthorized access, or submit harmful or misleading information.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800">Changes to Terms</h2>
              <p className="mt-2">
                We may update these terms as the service evolves. Continued use means you accept the updated terms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
