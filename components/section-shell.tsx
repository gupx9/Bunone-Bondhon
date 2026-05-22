import type { ReactNode } from 'react';

type SectionShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function SectionShell({ eyebrow, title, description, children }: SectionShellProps) {
  return (
    <section className="container-page py-10 sm:py-14">
      <div className="mb-8 max-w-3xl">
        {eyebrow ? <p className="section-kicker mb-3">{eyebrow}</p> : null}
        <h1 className="font-display text-3xl text-brown sm:text-5xl">{title}</h1>
        {description ? <p className="mt-4 text-base leading-7 text-brown/75 sm:text-lg">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}