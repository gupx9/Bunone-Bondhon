"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleClick() {
    // start curtain animation
    setOpen(true);
    // navigate after animation finishes
    setTimeout(() => router.push('/login'), 900);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream" onClick={handleClick}>
      <div className="text-center p-8">
        <h1 className="hero-title mb-4">Bunone Bondhon</h1>
        <p className="mb-6 text-brown/80">A premium Bengali boutique experience — click anywhere to enter</p>
        <div className={`curtain ${open ? 'open' : ''}`} aria-hidden>
          <div className="panel left" />
          <div className="panel right" />
        </div>
      </div>
    </div>
  );
}