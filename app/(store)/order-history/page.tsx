import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';

export default function OrderHistoryPage() {
  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
      <SectionShell
        eyebrow="Orders"
        title="A graceful record of every purchase"
        description="Orders will be grouped by date and powered by the Supabase orders and order_items tables."
      >
        <div className="surface p-8">
          <p className="text-brown/70">Order history will appear here once the Supabase queries are wired in.</p>
        </div>
      </SectionShell>
    </div>
  );
}