import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';
import { AdminDashboardCard } from '@/components/admin-dashboard-card';
import { requireAdminSession } from '@/lib/admin';

const cards = [
  {
    href: '/admin/products',
    title: 'Products',
    description: 'Add new items, update images, pricing, stock, and categories in one place.'
  },
  {
    href: '/admin/users',
    title: 'Users',
    description: 'Promote or demote users to admin from a dedicated management page.'
  },
  {
    href: '/admin/orders',
    title: 'Orders',
    description: 'Review purchases and open order details without cluttering the dashboard.'
  }
];

export const dynamic = 'force-dynamic';

export default async function AdminHomePage() {
  await requireAdminSession();

  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
      <SectionShell
        eyebrow="Admin"
        title="Choose a management area"
        description="Products, users, and orders are now split into separate pages. Use the cards below to open the section you need."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <AdminDashboardCard key={card.href} href={card.href} title={card.title} description={card.description} />
          ))}
        </div>
      </SectionShell>
    </div>
  );
}
