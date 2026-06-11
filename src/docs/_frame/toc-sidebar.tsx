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

    // Track each heading's visibility and pick the last one past the top
    // offset. IntersectionObserver replaces a scroll listener that read layout
    // for every id on every scroll event (layout thrash / scroll jank).
    const visibility = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.isIntersecting);
        }
        let found = "";
        for (const id of targetIds) {
          if (visibility.get(id)) {
            found = id;
            break;
          }
        }
        setActiveId(found);
      },
      { rootMargin: `-${OFFSET}px 0px 0px 0px`, threshold: 0 },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [idsKey]);

  return activeId;
}

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top, behavior: "smooth" });
}

export function TocSidebar({ items }: TocSidebarProps) {
  const allIds = items.flatMap((item) => [
    item.id,
    ...(item.children?.map((c) => c.id) ?? []),
  ]);
  const activeId = useActiveId(allIds);

  function isParentActive(item: TocItem) {
    if (activeId === item.id) return true;
    if (item.children?.some((c) => c.id === activeId)) return false;
    return false;
  }

  return (
    <aside className="sticky top-20 hidden w-52 shrink-0 self-start xl:block">
      <div className="rounded-lg border bg-background backdrop-blur-sm">
        <nav aria-label="Table of contents" className="p-3">
          <ul className="space-y-0.5">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "w-full rounded px-2 py-1 text-left text-sm transition-colors hover:text-foreground",
                    isParentActive(item)
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </button>
                {item.children && item.children.length > 0 && (
                  <ul className="mt-0.5 ml-2 space-y-0.5 border-border/60 border-l pl-2">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <button
                          type="button"
                          onClick={() => scrollTo(child.id)}
                          className={cn(
                            "w-full rounded px-2 py-0.5 text-left text-xs transition-colors hover:text-foreground",
                            activeId === child.id
                              ? "font-medium text-foreground"
                              : "text-muted-foreground/80",
                          )}
                        >
                          {child.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-3 border-border/60 border-t p-3">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-full rounded px-2 py-1 text-left text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            Back to top
          </button>
        </div>
      </div>
    </aside>
  );
}
