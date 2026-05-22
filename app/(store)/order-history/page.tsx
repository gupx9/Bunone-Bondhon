import { redirect } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';
import { getSession } from '@/lib/session';
import { getOrders } from '@/lib/store';

export const dynamic = 'force-dynamic';

function money(value: unknown) {
  return `৳${Number(value).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('en-BD', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value);
}

export default async function OrderHistoryPage() {
  const session = getSession();

  if (!session) {
    redirect('/login');
  }

  const orders = await getOrders(session.id);

  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
      <SectionShell
        eyebrow="Orders"
        title="A graceful record of every purchase"
        description="Order history now reads from Prisma and shows each completed order with its items."
      >
        {orders.length ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <article key={order.id.toString()} className="surface p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 pb-4">
                  <div>
                    <h2 className="font-display text-2xl text-brown">Order #{order.id.toString()}</h2>
                    <p className="text-sm text-brown/60">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gold">{money(order.totalPrice)}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-brown/50">{order.paymentMethod}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {order.orderItems.map((item, index) => (
                    <div key={`${order.id.toString()}-${index}`} className="flex items-center justify-between text-sm text-brown/75">
                      <span>{item.product.productName} x {item.quantity}</span>
                      <span>{money(Number(item.productPrice) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="surface p-8 text-brown/70">No orders yet. Your completed checkouts will appear here.</div>
        )}
      </SectionShell>
    </div>
  );
}