import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';
import { AdminModal } from '@/components/admin-modal';
import { AdminProductFields } from '@/components/admin-product-fields';
import { AdminProductCard } from '@/components/admin-product-card';
import { createProduct } from '@/app/actions';
import { requireAdminSession } from '@/lib/admin';
import { getProducts } from '@/lib/store';

export const dynamic = 'force-dynamic';

function money(value: unknown) {
  return `৳${Number(value).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function AdminProductsPage() {
  await requireAdminSession();
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
      <SectionShell
        eyebrow="Admin / Products"
        title="Manage inventory"
        description="Open a modal to create a new item or edit any product without crowding the page."
      >
        <div className="mb-6 flex justify-end">
          <AdminModal title="Create product" triggerLabel="Create product">
            <form action={createProduct} className="space-y-4">
              <AdminProductFields />
              <div className="flex justify-end pt-2">
                <button type="submit" className="button-primary">Create product</button>
              </div>
            </form>
          </AdminModal>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {products.map((product) => (
            <AdminProductCard key={product.id.toString()} product={product} />
          ))}
        </div>
      </SectionShell>
    </div>
  );
}
