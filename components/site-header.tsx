import Image from 'next/image';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { logout } from '@/app/actions';
import { prisma } from '@/lib/prisma';

export async function SiteHeader() {
  const session = getSession();
  let isAdmin = false;

  if (session) {
    try {
      const profile = await prisma.profile.findUnique({ where: { id: session.id } });
      isAdmin = !!profile && profile.role === 'admin';
    } catch {
      // On DB errors, be strict: do not fallback to session.role
      isAdmin = false;
    }
  }

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
          <Link href="/shop" className="rounded-full px-4 py-2 transition hover:bg-gold/15 hover:text-maroon">Shop</Link>
          <Link href="/cart" className="rounded-full px-4 py-2 transition hover:bg-gold/15 hover:text-maroon">Cart</Link>
          <Link href="/order-history" className="rounded-full px-4 py-2 transition hover:bg-gold/15 hover:text-maroon">Orders</Link>

          {isAdmin ? (
            <Link href="/admin" className="rounded-full px-4 py-2 transition hover:bg-gold/15 hover:text-maroon">Admin</Link>
          ) : null}

          {!session ? (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 transition hover:bg-gold/15 hover:text-maroon">Sign in</Link>
              <Link href="/register" className="rounded-full px-4 py-2 transition hover:bg-gold/15 hover:text-maroon">Register</Link>
            </>
          ) : (
            <form action={logout} className="inline">
              <button type="submit" className="rounded-full px-4 py-2 transition hover:bg-gold/15 hover:text-maroon">Sign out</button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}