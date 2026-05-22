import { redirect } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { getAdminSnapshot } from '@/lib/store';
import { updateProduct, updateUserRole } from '@/app/actions';

export const dynamic = 'force-dynamic';

function money(value: unknown) {
  return `৳${Number(value).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function AdminPage() {
  const session = getSession();

  if (!session) {
    redirect('/login');
  }

  const profile = await prisma.profile.findUnique({ where: { id: session.id } });

  if (!profile || profile.role !== 'admin') {
    redirect('/shop');
  }

  const { products, orders, users } = await getAdminSnapshot();

  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
      <SectionShell
        eyebrow="Admin"
        title="Product and order control center"
        description="This dashboard now edits products and reviews orders from Prisma-backed tables."
      >
        <div className="space-y-8">
          <div className="surface p-6">
            <h2 className="font-display text-2xl text-brown">Users</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {users.map((user) => (
                <form key={user.id} action={updateUserRole} className="rounded-2xl border border-line bg-white/70 p-4">
                  <input type="hidden" name="profileId" value={user.id} />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-brown">{user.fullName}</p>
                      <p className="text-sm text-brown/60">{user.email}</p>
                    </div>
                    <span className="rounded-full bg-maroon/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-maroon">
                      {user.role}
                    </span>
                  </div>
                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-brown">Role</label>
                    <select name="role" defaultValue={user.role} className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3">
                      <option value="customer">customer</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>
                  <button type="submit" className="button-primary mt-4 w-full">
                    Save role
                  </button>
                </form>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {products.map((product) => (
              <form key={product.id.toString()} action={updateProduct} className="surface space-y-4 p-6">
                <input type="hidden" name="productId" value={product.id.toString()} />
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-2xl text-brown">{product.productName}</h2>
                  <span className="rounded-full bg-maroon/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-maroon">{product.type}</span>
                </div>
                <label className="block text-sm font-medium text-brown">Product name</label>
                <input name="productName" defaultValue={product.productName} className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-brown">Stock</label>
                    <input name="inStock" type="number" defaultValue={product.inStock} className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown">Price</label>
                    <input name="price" type="number" step="0.01" defaultValue={Number(product.price)} className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown">Description</label>
                  <textarea name="description" defaultValue={product.description ?? ''} className="min-h-28 w-full rounded-2xl border border-line bg-white/80 px-4 py-3" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-brown">Image URL</label>
                    <input name="imageUrl" defaultValue={product.imageUrl ?? ''} className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown">Type</label>
                    <select name="type" defaultValue={product.type} className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3">
                      <option value="jewellery">jewellery</option>
                      <option value="clothing">clothing</option>
                      <option value="mufflers">mufflers</option>
                      <option value="other">other</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm font-semibold text-gold">{money(product.price)} • {product.inStock} stock</p>
                  <button type="submit" className="button-primary">Update</button>
                </div>
              </form>
            ))}
          </div>

          <div className="surface p-6">
            <h2 className="font-display text-2xl text-brown">Orders</h2>
            <div className="mt-4 space-y-4">
              {orders.length ? orders.map((order) => (
                <div key={order.id.toString()} className="rounded-2xl border border-line bg-white/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-brown">Order #{order.id.toString()}</p>
                      <p className="text-sm text-brown/60">{order.user.fullName} • {order.user.email}</p>
                    </div>
                    <p className="font-semibold text-gold">{money(order.totalPrice)}</p>
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-brown/75">
                    {order.orderItems.map((item, index) => (
                      <p key={`${order.id.toString()}-${index}`}>{item.product.productName} x {item.quantity}</p>
                    ))}
                  </div>
                </div>
              )) : <p className="text-brown/70">No orders yet.</p>}
            </div>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}