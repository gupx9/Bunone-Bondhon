import type { Metadata } from 'next';
import { Hind_Siliguri, Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';

const display = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });
const body = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body' });
const bengali = Hind_Siliguri({ subsets: ['latin', 'bengali'], weight: ['400', '500', '600', '700'], variable: '--font-bengali' });

export const metadata: Metadata = {
  title: 'Bunone Bondhon',
  description: 'Premium Bengali boutique storefront built with Next.js, Tailwind, and Supabase.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${bengali.variable}`}>
      <body>{children}</body>
    </html>
  );
}