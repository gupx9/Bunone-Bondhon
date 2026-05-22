import Image from 'next/image';
import Link from 'next/link';

const navigation = [
  { href: '/shop', label: 'Shop' },
  { href: '/cart', label: 'Cart' },
  { href: '/order-history', label: 'Orders' },
  { href: '/admin', label: 'Admin' }
];

export function SiteHeader() {
  return (
    <header className="border-b border-line/80 bg-ivory/90 backdrop-blur-md">
      <div className="container-page flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/shop" className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-line bg-ivory shadow-bloom">
            <Image src="/logo.jpg" alt="Bunone Bondhon logo" fill className="object-cover" />
          </div>
          <div>
            <p className="font-display text-xl text-brown">Bunone Bondhon</p>
            <p className="text-xs uppercase tracking-[0.24em] text-maroon/70">Luxury Bengali Boutique</p>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-brown/80">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 transition hover:bg-gold/15 hover:text-maroon"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}