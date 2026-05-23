import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';
import { createLocalSession } from '@/app/actions';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
          <SectionShell eyebrow="Member access" title="Enter the boutique">
            <div className="surface mx-auto max-w-xl p-8">
              <form action={createLocalSession} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-brown">Email</label>
                  <input
                    className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-gold"
                    type="email"
                    name="email"
                    placeholder="you@gmail.com"
                    pattern=".+@gmail\.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-brown">Password</label>
                  <input className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-gold" type="password" name="password" placeholder="Your password" required />
                </div>

                <div className="flex items-center justify-between">
                  <Link className="text-sm text-maroon/80 hover:underline" href="/forgot">Forgot password?</Link>
                </div>

                <button type="submit" className="button-primary w-full">
                  Sign in
                </button>
              </form>
              <p className="mt-6 text-sm text-brown/70">
                New here? <Link className="font-semibold text-maroon underline-offset-4 hover:underline" href="/register">Create an account</Link>
              </p>
            </div>
          </SectionShell>
    </div>
  );
}