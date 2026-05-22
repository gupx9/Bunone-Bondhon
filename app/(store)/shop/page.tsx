import Image from 'next/image';
import { SiteHeader } from '@/components/site-header';
import { SectionShell } from '@/components/section-shell';

const showcase = [
  {
    name: 'Gold Necklace',
    price: '৳1,500',
    category: 'jewellery',
    image: 'https://i.ibb.co.com/wF9b8XZ0/gold-necklace.jpg'
  },
  {
    name: 'Traditional Saree',
    price: '৳2,800',
    category: 'clothing',
    image: 'https://i.ibb.co.com/j9WkwZyK/traditional-saree.jpg'
  },
  {
    name: 'Handmade Bag',
    price: '৳800',
    category: 'other',
    image: 'https://i.ibb.co.com/9HKGxrX1/handmade-bag.jpg'
  }
];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-warm-radial">
      <SiteHeader />
      <SectionShell
        eyebrow="Collection"
        title="A warm, premium storefront for handcrafted fashion"
        description="This is the new Next.js shopping experience. The data layer will be connected to Supabase tables and auth next."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {showcase.map((item) => (
            <article key={item.name} className="card">
              <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-2xl text-brown">{item.name}</h2>
                  <span className="rounded-full bg-maroon/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-maroon">
                    {item.category}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gold">{item.price}</p>
                <div className="flex gap-3 pt-2">
                  <button className="button-primary flex-1" type="button">Add to cart</button>
                  <button className="button-secondary" type="button">Details</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}