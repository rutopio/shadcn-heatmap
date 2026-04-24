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

  useEffect(() => {
    function update() {
      let found = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= OFFSET) {
          found = id;
        }
      }
      setActiveId(found); // eslint-disable-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [ids]);

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
      <div className="bg-background rounded-lg border backdrop-blur-sm">
        <nav aria-label="Table of contents" className="p-3">
          <ul className="space-y-0.5">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "hover:text-foreground w-full rounded px-2 py-1 text-left text-sm transition-colors",
                    isParentActive(item)
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </button>
                {item.children && item.children.length > 0 && (
                  <ul className="border-border/60 mt-0.5 ml-2 space-y-0.5 border-l pl-2">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <button
                          onClick={() => scrollTo(child.id)}
                          className={cn(
                            "hover:text-foreground w-full rounded px-2 py-0.5 text-left text-xs transition-colors",
                            activeId === child.id
                              ? "text-foreground font-medium"
                              : "text-muted-foreground/80"
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
        <div className="border-border/60 mt-3 border-t p-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-muted-foreground hover:text-foreground w-full rounded px-2 py-1 text-left text-sm transition-colors"
          >
            Back to top
          </button>
        </div>
      </div>
    </aside>
  );
}
