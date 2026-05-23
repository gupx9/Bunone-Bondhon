import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';
import { AdminModal } from '@/components/admin-modal';
import { requireAdminSession } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function money(value: unknown) {
  return `৳${Number(value).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function AdminOrdersPage() {
  await requireAdminSession();
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
      <SectionShell
        eyebrow="Admin / Orders"
        title="Review orders"
        description="View orders in a clean list and open a modal for full item details when needed."
      >
        <div className="space-y-4">
          {orders.length ? orders.map((order) => (
            <article key={order.id.toString()} className="surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-brown">Order #{order.id.toString()}</p>
                  <p className="text-sm text-brown/60">{order.user.fullName} • {order.user.email}</p>
                </div>
                <p className="font-semibold text-gold">{money(order.totalPrice)}</p>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm text-brown/70">{order.orderItems.length} item(s) • {order.orderStatus}</p>
                <AdminModal title={`Order #${order.id.toString()}`} triggerLabel="View details">
                  <div className="space-y-3 text-sm text-brown/80">
                    <p><strong>Customer:</strong> {order.user.fullName} ({order.user.email})</p>
                    <p><strong>Status:</strong> {order.orderStatus}</p>
                    <p><strong>Total:</strong> {money(order.totalPrice)}</p>
                    <div className="space-y-2 rounded-2xl border border-line bg-white/70 p-4">
                      {order.orderItems.map((item, index) => (
                        <p key={`${order.id.toString()}-${index}`}>
                          {item.product.productName} x {item.quantity}
                        </p>
                      ))}
                    </div>
                  </div>
                </AdminModal>
              </div>
            </article>
          )) : <p className="text-brown/70">No orders yet.</p>}
        </div>
      </SectionShell>
    </div>
  );
}
