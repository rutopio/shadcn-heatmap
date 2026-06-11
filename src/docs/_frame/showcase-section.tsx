import type { HTMLAttributes } from "react";

import type { TocItem } from "./toc-sidebar";
import { TocSidebar } from "./toc-sidebar";

export function ShowcaseSection({
  label,
  toc,
  children,
}: {
  label: string;
  toc?: TocItem[];
  children: HTMLAttributes<HTMLElement>["children"];
}) {
  return (
    <section className="py-12 sm:py-20 md:py-24" aria-label={label}>
      <div className="container">
        {toc ? (
          <div className="flex gap-10">
            <TocSidebar items={toc} />
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
