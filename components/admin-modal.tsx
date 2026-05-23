"use client";

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export function AdminModal({
  title,
  triggerLabel,
  children,
  triggerClassName = 'button-secondary',
  panelClassName = 'surface w-full max-w-4xl max-h-[90vh] overflow-y-auto p-5 sm:p-6'
}: {
  title: string;
  triggerLabel: string;
  children: ReactNode;
  triggerClassName?: string;
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => setOpen(true)}>
        {triggerLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm sm:p-6" onClick={() => setOpen(false)}>
          <div className={panelClassName} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="font-display text-2xl text-brown">{title}</h3>
              <button type="button" className="button-secondary" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}
