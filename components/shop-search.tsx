"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function ShopSearch({ initialValue = '' }: { initialValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query.trim()) {
        params.set('search', query.trim());
      } else {
        params.delete('search');
      }

      router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname, { scroll: false });
    }, 180);

    return () => window.clearTimeout(timer);
  }, [pathname, query, router, searchParams]);

  return (
    <div className="surface p-4 md:p-5">
      <label className="mb-2 block text-sm font-semibold text-brown">Search product name</label>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search clothing, accessories, jewellery..."
        className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-gold"
      />
    </div>
  );
}