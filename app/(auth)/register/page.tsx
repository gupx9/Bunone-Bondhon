import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
      <SectionShell
        eyebrow="Create account"
        title="Join the Bunone Bondhon experience"
        description="Profile fields are kept for customer details, order history, and premium support."
      >
        <div className="surface mx-auto max-w-2xl p-8">
          <form className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-brown">Role</label>
              <select className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-gold">
                <option>customer</option>
                <option>admin</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-brown">Name</label>
              <input className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-gold" type="text" placeholder="Full name" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-brown">Email</label>
              <input className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-gold" type="email" placeholder="you@example.com" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-brown">Phone</label>
              <input className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-gold" type="tel" placeholder="Phone number" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-brown">Password</label>
              <input className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-gold" type="password" placeholder="••••••••" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-brown">Address</label>
              <textarea className="min-h-28 w-full rounded-2xl border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-gold" placeholder="Shipping address" />
            </div>
            <button type="button" className="button-primary sm:col-span-2">
              Create account
            </button>
          </form>
          <p className="mt-6 text-sm text-brown/70">
            Already registered? <Link className="font-semibold text-maroon underline-offset-4 hover:underline" href="/login">Sign in</Link>
          </p>
        </div>
      </SectionShell>
    </div>
  );
}