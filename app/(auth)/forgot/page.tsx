import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';

export default function ForgotPage() {
  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
      <SectionShell eyebrow="Recover access" title="Forgot your password?">
        <div className="surface mx-auto max-w-xl p-8">
          <p className="mb-4 text-brown/80">Enter your email or phone number and we'll send a verification code (placeholder UI).</p>
          <form className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-brown">Email (or phone)</label>
              <input className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-gold" type="text" name="identifier" placeholder="you@gmail.com or +8801XXXXXXXXX" />
            </div>
            <div className="flex justify-between items-center">
              <button type="button" className="button-primary">Send code</button>
              <Link href="/login" className="text-sm text-maroon/80 hover:underline">Back to sign in</Link>
            </div>
          </form>
        </div>
      </SectionShell>
    </div>
  );
}
