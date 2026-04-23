import {
    StatusCustomStylingDemo,
    StatusCustomTooltipDemo,
    StatusI18nDemo,
    StatusNoFooterDemo,
    StatusNoLabelsDemo,
    StatusUptimeDemo,
    StatusWithLabelsDemo,
} from "@/components/demos/status";

export const statusVariantItems = [
    {
        title: "Colors & block size",
        description:
            "Use colors to theme the blocks, labelClassName to style date labels, className on Stat and Legend to style the footer, and blockSize/blockSizeRatio/blockMargin to adjust block dimensions.",
        preview: <StatusCustomStylingDemo />,
        code: `<StatusHeatmap
  data={data}
  blockSize={60}
  blockSizeRatio={0.1}
  blockMargin={3}
  colors={{
    critical: "#dc2626",
    degraded: "#ea580c",
    healthy: "#16a34a",
  }}
>
  <StatusHeatmapBody labelClassName="text-destructive font-bold">
    {({ activity, dayIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
          <p className="text-muted-foreground">{STATUS_LABELS[activity.value]}</p>
        </TooltipContent>
      </Tooltip>
    )}
  </StatusHeatmapBody>
  <StatusHeatmapFooter>
    <StatusHeatmapStat />
    <StatusHeatmapLegend />
  </StatusHeatmapFooter>
</StatusHeatmap>`,
    },
    {
        title: "No footer",
        description:
            "Omit the footer entirely for a minimal, distraction-free status timeline.",
        preview: <StatusNoFooterDemo />,
        code: `<StatusHeatmap data={data}>
  <StatusHeatmapBody>
    {({ activity, dayIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
          <p className="text-muted-foreground">{STATUS_LABELS[activity.value]}</p>
        </TooltipContent>
      </Tooltip>
    )}
  </StatusHeatmapBody>
</StatusHeatmap>`,
    },
    {
        title: "Grid only",
        description:
            "Strip date labels — great for inline cards or a hero preview.",
        preview: <StatusNoLabelsDemo />,
        code: `<StatusHeatmap data={data}>
  <StatusHeatmapBody hideDateLabels>
    {({ activity, dayIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
          <p className="text-muted-foreground">{STATUS_LABELS[activity.value]}</p>
        </TooltipContent>
      </Tooltip>
    )}
  </StatusHeatmapBody>
</StatusHeatmap>`,
    },
    {
        title: "Custom tooltip",
        description:
            "Replace the default tooltip with any JSX — add emoji, charts, or extra metadata without touching the heatmap internals.",
        preview: <StatusCustomTooltipDemo />,
        code: `<StatusHeatmap data={data}>
  <StatusHeatmapBody>
    {({ activity, dayIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none" sideOffset={6}>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold">
              {format(parseISO(activity.date), "EEEE, MMM d")}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">
                {activity.value === 0 ? "⬜" : activity.value === 1 ? "🔴" : activity.value === 2 ? "🟡" : "🟢"}
              </span>
              <span className="text-muted-foreground text-xs">
                {STATUS_LABELS[activity.value]}
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    )}
  </StatusHeatmapBody>
  <StatusHeatmapFooter>
    <StatusHeatmapStat />
    <StatusHeatmapLegend />
  </StatusHeatmapFooter>
</StatusHeatmap>`,
    },
    {
        title: "i18n labels (e.g., Traditional Chinese)",
        description:
            "Pass a date-fns locale to localise date formatting, and use labels to translate status names and the stat text.",
        preview: <StatusI18nDemo />,
        code: `import { zhTW } from "date-fns/locale";

<StatusHeatmap
  data={data}
  locale={zhTW}
  labels={{
    statuses: { noData: "無資料", critical: "嚴重異常", degraded: "效能降級", healthy: "運作正常" },
    stat: "{{value}} 天運作正常",
  }}
>
  <StatusHeatmapBody>
    {({ activity, dayIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">{format(parseISO(activity.date), "PPP", { locale: zhTW })}</p>
          <p className="text-muted-foreground">
            {activity.value === 0 ? "無資料" : activity.value === 1 ? "嚴重異常" : activity.value === 2 ? "效能降級" : "運作正常"}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </StatusHeatmapBody>
  <StatusHeatmapFooter>
    <StatusHeatmapStat />
    <StatusHeatmapLegend />
  </StatusHeatmapFooter>
</StatusHeatmap>`,
    },
    {
        title: "Custom date label interval",
        description:
            "Date labels are shown by default. Use `labelInterval` to control how often they appear.",
        preview: <StatusWithLabelsDemo />,
        code: `<StatusHeatmap data={data}>
  <StatusHeatmapBody labelInterval={15}>
    {({ activity, dayIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
          <p className="text-muted-foreground">{STATUS_LABELS[activity.value]}</p>
        </TooltipContent>
      </Tooltip>
    )}
  </StatusHeatmapBody>
  <StatusHeatmapFooter>
    <StatusHeatmapStat />
    <StatusHeatmapLegend />
  </StatusHeatmapFooter>
</StatusHeatmap>`,
    },
    {
        title: "Compact (30 days)",
        description: "Show a shorter time period with smaller blocks.",
        preview: <StatusUptimeDemo />,
        code: `<StatusHeatmap
  data={last30Days}
  blockSize={32}
  blockSizeRatio={0.25}
  blockMargin={1.5}
>
  <StatusHeatmapBody>
    {({ activity, dayIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
          <p className="text-muted-foreground">{STATUS_LABELS[activity.value]}</p>
        </TooltipContent>
      </Tooltip>
    )}
  </StatusHeatmapBody>
  <StatusHeatmapFooter>
    <StatusHeatmapStat />
    <StatusHeatmapLegend />
  </StatusHeatmapFooter>
</StatusHeatmap>`,
    },
];
