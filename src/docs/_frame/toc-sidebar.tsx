import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type TocItem = {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
};

type TocSidebarProps = {
  items: TocItem[];
};

const OFFSET = 96;

function useActiveId(ids: string[]) {
  const [activeId, setActiveId] = useState<string>("");
  // Stable key so the observer only re-subscribes when the id set changes,
  // not on every render (ids is a fresh array each render).
  const idsKey = ids.join("|");

  useEffect(() => {
    const targetIds = idsKey ? idsKey.split("|") : [];
    const elements = targetIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      let current = elements[0].id;
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= OFFSET + 1)
          current = element.id;
      }
      setActiveId(current);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [idsKey]);

  return activeId;
}

export function TocSidebar({ items }: TocSidebarProps) {
  const allIds = items.flatMap((item) => [
    item.id,
    ...(item.children?.map((c) => c.id) ?? []),
  ]);
  const activeId = useActiveId(allIds);

  return (
    <aside className="sticky top-20 hidden w-52 shrink-0 self-start xl:block">
      <div className="bg-background rounded-lg border backdrop-blur-sm">
        <nav aria-label="Table of contents" className="p-3">
          <ul className="space-y-0.5">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={activeId === item.id ? "location" : undefined}
                  className={cn(
                    "hover:text-foreground block w-full rounded px-2 py-1 text-left text-sm transition-colors",
                    activeId === item.id
                      ? "text-foreground font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </a>
                {item.children && item.children.length > 0 && (
                  <ul className="border-border/60 mt-0.5 ml-2 space-y-0.5 border-l pl-2">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <a
                          href={`#${child.id}`}
                          aria-current={
                            activeId === child.id ? "location" : undefined
                          }
                          className={cn(
                            "hover:text-foreground block w-full rounded px-2 py-0.5 text-left text-xs transition-colors",
                            activeId === child.id
                              ? "text-foreground font-medium"
                              : "text-muted-foreground/80",
                          )}
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-border/60 mt-3 border-t p-3">
          <a
            href="#top"
            className="text-muted-foreground hover:text-foreground block w-full rounded px-2 py-1 text-left text-sm transition-colors"
          >
            Back to top
          </a>
        </div>
      </div>
    </aside>
  );
}
