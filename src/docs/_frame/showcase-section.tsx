import type { HTMLAttributes } from "react";

export function ShowcaseSection({
  label,
  children,
}: {
  label: string;
  children: HTMLAttributes<HTMLElement>["children"];
}) {
  return (
    <section className="py-12 sm:py-20 md:py-24" aria-label={label}>
      <div className="container">{children}</div>
    </section>
  );
}
