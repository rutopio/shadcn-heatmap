import { Badge } from "@/components/ui/badge";
import type { ComponentPropsSection } from "@/content/types";
import type { ReactNode } from "react";

type PropsTableProps = {
  sections: ComponentPropsSection[];
};

function parseDescription(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  // Match `code` blocks
  const codeRegex = /`([^`]+)`/g;
  let match;

  while ((match = codeRegex.exec(text)) !== null) {
    // Add text before the code block
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add the code element
    parts.push(
      <code
        key={match.index}
        className="rounded bg-muted px-1 py-0.5 font-mono text-xs"
      >
        {match[1]}
      </code>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

export function PropsTable({ sections }: PropsTableProps) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.componentName} className="space-y-3">
          <div className="flex flex-col gap-1">
            <h4 className="font-mono text-sm font-semibold">
              {section.componentName}
            </h4>
            <p className="text-sm text-muted-foreground">
              {section.description}
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Prop</th>
                  <th className="px-4 py-2 text-left font-medium">Type</th>
                  <th className="px-4 py-2 text-left font-medium">Default</th>
                  <th className="px-4 py-2 text-left font-medium">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {section.props.map((prop) => (
                  <tr
                    key={prop.name}
                    className="border-t align-top last:border-b-0"
                  >
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-[13px] font-medium">
                          {prop.name}
                        </code>
                        {prop.required && (
                          <Badge
                            variant="outline"
                            className="text-[10px] font-normal"
                          >
                            required
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <code className="break-words font-mono text-[13px] text-chart-1">
                        {prop.type}
                      </code>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {prop.default ? (
                        <code className="font-mono text-[13px] text-muted-foreground">
                          {prop.default}
                        </code>
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-muted-foreground">
                      {prop.description ? parseDescription(prop.description) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
