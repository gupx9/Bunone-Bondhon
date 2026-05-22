import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
      <SectionShell
        eyebrow="Cart"
        title="Review your selected pieces"
        description="Quantity controls, checkout, and payment flow will be connected to Supabase in the next implementation pass."
      >
        <div className="surface p-8">
          <p className="text-brown/70">Cart data will load here from the Supabase cart_items table.</p>
        </div>
      </SectionShell>
    </div>
  );
}