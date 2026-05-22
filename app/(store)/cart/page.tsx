import { redirect } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';
import { checkout, updateCartQuantity } from '@/app/actions';
import { getSession } from '@/lib/session';
import { getCartItems } from '@/lib/store';

export const dynamic = 'force-dynamic';

function money(value: unknown) {
  return `৳${Number(value).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function CartPage() {
  const session = getSession();

  if (!session) {
    redirect('/login');
  }

  const cartItems = await getCartItems(session.id);
  const total = cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
      <SectionShell
        eyebrow="Cart"
        title="Review your selected pieces"
        description="Quantity controls and checkout now run through Prisma-backed server actions."
      >
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="surface overflow-hidden">
            {cartItems.length ? (
              <div className="divide-y divide-line/70">
                {cartItems.map((item) => (
                  <div key={item.id.toString()} className="grid gap-4 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <h2 className="font-display text-2xl text-brown">{item.product.productName}</h2>
                      <p className="text-sm text-brown/70">{money(item.product.price)} each</p>
                      <p className="mt-2 text-sm text-brown/60">{item.quantity} item(s) in cart</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <form action={updateCartQuantity}>
                        <input type="hidden" name="productId" value={item.productId.toString()} />
                        <input type="hidden" name="action" value="add" />
                        <button className="button-secondary" type="submit">+ Add One</button>
                      </form>
                      <form action={updateCartQuantity}>
                        <input type="hidden" name="productId" value={item.productId.toString()} />
                        <input type="hidden" name="action" value="remove" />
                        <button className="button-secondary" type="submit">- Remove One</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-brown/70">Your cart is empty. Go back to the shop to add handcrafted pieces.</div>
            )}
          </div>

          <div className="surface p-6">
            <div className="space-y-3 border-b border-line/70 pb-4">
              <div className="flex items-center justify-between text-sm text-brown/70">
                <span>Items</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold text-brown">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
            </div>
            <form action={checkout} className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-brown">Payment method</label>
              <select name="paymentMethod" className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3">
                <option value="cod">COD</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="card">Card</option>
                <option value="other">Other</option>
              </select>
              <button className="button-primary w-full" type="submit" disabled={!cartItems.length}>
                Confirm Payment
              </button>
            </form>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}