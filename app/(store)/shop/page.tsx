import Image from 'next/image';
import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';
import { addToCart } from '@/app/actions';
import { getProducts } from '@/lib/store';

export const dynamic = 'force-dynamic';

function money(value: unknown) {
  return `৳${Number(value).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
      <SectionShell
        eyebrow="Collection"
        title="A warm, premium storefront for handcrafted fashion"
        description="The catalog now reads from Prisma and keeps working even if the database is not reachable yet."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((item) => (
            <article key={item.id.toString()} className="card">
              <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
                <Image src={item.imageUrl ?? '/header.jpg'} alt={item.productName} fill className="object-cover" />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-2xl text-brown">{item.productName}</h2>
                  <span className="rounded-full bg-maroon/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-maroon">
                    {item.type}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gold">{money(item.price)}</p>
                <p className="text-sm text-brown/70">{item.description ?? 'Handcrafted with care.'}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-brown/50">{item.inStock} in stock</p>
                <form action={addToCart} className="flex gap-3 pt-2">
                  <input type="hidden" name="productId" value={item.id.toString()} />
                  <input className="w-20 rounded-full border border-line bg-white/80 px-3 py-2 text-center text-sm" type="number" name="quantity" min={1} defaultValue={1} />
                  <button className="button-primary flex-1" type="submit">Add to cart</button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}