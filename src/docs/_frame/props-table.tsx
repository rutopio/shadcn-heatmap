import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import type { ComponentPropsSection } from "@/docs/types";

type PropsTableProps = {
  sections: ComponentPropsSection[];
};

function parseDescription(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  // Match `code` blocks
  const codeRegex = /`([^`]+)`/g;
  let match = codeRegex.exec(text);

  while (match !== null) {
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
      </code>,
    );

    lastIndex = match.index + match[0].length;
    match = codeRegex.exec(text);
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export function PropsTable({ sections }: PropsTableProps) {
  return (
    <div className="space-y-8 bg-background">
      {sections.map((section) => (
        <div key={section.componentName} className="space-y-3">
          <div className="flex flex-col gap-1">
            <h3
              id={`props-heading-${section.componentName}`}
              className="text-balance font-mono font-semibold text-sm"
            >
              {section.componentName}
            </h3>
            <p className="text-pretty text-muted-foreground text-sm">
              {section.description}
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table
              aria-labelledby={`props-heading-${section.componentName}`}
              className="w-full text-sm"
            >
              <thead className="bg-muted text-muted-foreground">
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
                        <code className="font-medium font-mono text-sm">
                          {prop.name}
                        </code>
                        {prop.required && (
                          <Badge
                            variant="secondary"
                            className="font-normal text-xs"
                          >
                            required
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <code className="break-words font-mono text-chart-1 text-sm">
                        {prop.type}
                      </code>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {prop.default ? (
                        <code className="font-mono text-muted-foreground text-sm">
                          {prop.default}
                        </code>
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-muted-foreground">
                      {prop.description
                        ? parseDescription(prop.description)
                        : null}
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
