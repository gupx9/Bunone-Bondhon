import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
      <SectionShell
        eyebrow="Member access"
        title="Sign in to your boutique dashboard"
        description="Warm, premium, and simple. This page will be wired to Supabase Auth in the next step."
      >
        <div className="surface mx-auto max-w-xl p-8">
          <form className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-brown">Email</label>
              <input className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-gold" type="email" placeholder="you@example.com" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-brown">Password</label>
              <input className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-gold" type="password" placeholder="••••••••" />
            </div>
            <button type="button" className="button-primary w-full">
              Continue with Supabase
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