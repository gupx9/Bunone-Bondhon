import Link from 'next/link';

export function AdminDashboardCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="surface block p-6 transition hover:-translate-y-1 hover:shadow-glow">
      <h2 className="font-display text-3xl text-brown">{title}</h2>
      <p className="mt-3 text-sm text-brown/70">{description}</p>
      <span className="mt-6 inline-flex rounded-full bg-maroon/10 px-4 py-2 text-sm font-semibold text-maroon">Open</span>
    </Link>
  );
}