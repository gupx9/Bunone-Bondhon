import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
      <SectionShell
        eyebrow="Admin"
        title="Product and order control center"
        description="This dashboard will manage inventory, prices, and order review against Supabase with role-based access."
      >
        <div className="surface p-8">
          <p className="text-brown/70">Admin product editing and transaction review will be built on the new schema.</p>
        </div>
      </SectionShell>
    </div>
  );
}