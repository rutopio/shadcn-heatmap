"use client";

import { useState } from "react";
import { de, ja, es, enUS, zhTW, fr } from "date-fns/locale";
import type { Locale, Day } from "date-fns";
import { format, parseISO } from "date-fns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarHeatmap,
  CalendarHeatmapBlock,
  CalendarHeatmapBody,
  CalendarHeatmapFooter,
  CalendarHeatmapLegend,
  CalendarHeatmapTotalCount,
} from "@/components/heatmap/calendar-heatmap";
import {
  WeekdayHeatmap,
  WeekdayHeatmapBlock,
  WeekdayHeatmapBody,
  WeekdayHeatmapFooter,
  WeekdayHeatmapLegend,
  WeekdayHeatmapTotalCount,
} from "@/components/heatmap/weekday-heatmap";
import {
  DateHeatmap,
  DateHeatmapBlock,
  DateHeatmapBody,
  DateHeatmapFooter,
  DateHeatmapLegend,
  DateHeatmapTotalCount,
} from "@/components/heatmap/date-heatmap";
import { generateMonthSample } from "@/data/month-sample";
import { generateWeekSample } from "@/data/week-sample";
import { generateDateSample } from "@/data/date-sample";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  WeekTooltipContent,
  DateTooltipContent,
  HeatmapTooltip,
} from "./demos/shared";

const LOCALES: Record<string, Locale> = {
  en: enUS,
  de,
  ja,
  es,
  "zh-TW": zhTW,
  fr,
};

const monthData = generateMonthSample(42, 2025);
const weekData = generateWeekSample(17);
const dateData = generateDateSample(31, 14);

type MonthProps = {
  continuousMonths: boolean;
  hasEmptyColumn: boolean;
  weekStart: Day;
  maxLevel: number;
  blockSize: number;
  blockMargin: number;
  blockRadius: number;
  locale: string;
};

type WeekProps = {
  weekStart: Day;
  use12Hour: boolean;
  maxLevel: number;
  blockSize: number;
  blockMargin: number;
  blockRadius: number;
  locale: string;
};

type DateProps = {
  use12Hour: boolean;
  maxLevel: number;
  blockSize: number;
  blockMargin: number;
  blockRadius: number;
  locale: string;
};

function MonthPlayground({ props }: { props: MonthProps }) {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <CalendarHeatmap
        data={monthData}
        continuousMonths={props.continuousMonths}
        hasEmptyColumn={props.hasEmptyColumn}
        weekStart={props.weekStart}
        maxLevel={props.maxLevel}
        blockSize={props.blockSize}
        blockMargin={props.blockMargin}
        blockRadius={props.blockRadius}
        locale={LOCALES[props.locale]}
      >
        <CalendarHeatmapBody>
          {({ activity, dayIndex, weekIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <CalendarHeatmapBlock
                  activity={activity}
                  dayIndex={dayIndex}
                  weekIndex={weekIndex}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
                <p className="text-muted-foreground">
                  {activity.value} contribution{activity.value !== 1 ? "s" : ""}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </CalendarHeatmapBody>
        <CalendarHeatmapFooter>
          <CalendarHeatmapTotalCount />
          <CalendarHeatmapLegend />
        </CalendarHeatmapFooter>
      </CalendarHeatmap>
    </TooltipProvider>
  );
}

function WeekPlayground({ props }: { props: WeekProps }) {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        weekStart={props.weekStart}
        use12Hour={props.use12Hour}
        maxLevel={props.maxLevel}
        blockSize={props.blockSize}
        blockMargin={props.blockMargin}
        blockRadius={props.blockRadius}
        locale={LOCALES[props.locale]}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip content={<WeekTooltipContent activity={activity} use12Hour={props.use12Hour} />}>
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapTotalCount />
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

function DatePlayground({ props }: { props: DateProps }) {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={dateData}
        use12Hour={props.use12Hour}
        maxLevel={props.maxLevel}
        blockSize={props.blockSize}
        blockMargin={props.blockMargin}
        blockRadius={props.blockRadius}
        locale={LOCALES[props.locale]}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex }) => (
            <HeatmapTooltip content={<DateTooltipContent activity={activity} use12Hour={props.use12Hour} />}>
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapTotalCount />
          <DateHeatmapLegend />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

function ControlPanel<T extends Record<string, unknown>>({
  props,
  onPropsChange,
  config,
}: {
  props: T;
  onPropsChange: (key: keyof T, value: unknown) => void;
  config: Array<{
    key: keyof T;
    label: string;
    type: "boolean" | "number" | "locale";
    min?: number;
    max?: number;
  }>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Props</h3>
      <div className="space-y-3">
        {config.map((item) => (
          <div key={String(item.key)} className="flex items-center justify-between gap-4">
            <Label htmlFor={String(item.key)} className="text-sm">
              {item.label}
            </Label>
            {item.type === "boolean" && (
              <Checkbox
                id={String(item.key)}
                checked={props[item.key] as boolean}
                onCheckedChange={(checked) => onPropsChange(item.key, checked)}
              />
            )}
            {item.type === "number" && (
              <Input
                id={String(item.key)}
                type="number"
                value={props[item.key] as number}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || 0;
                  const clampedValue = Math.max(
                    item.min ?? -Infinity,
                    Math.min(item.max ?? Infinity, value)
                  );
                  onPropsChange(item.key, clampedValue as Day & number);
                }}
                min={item.min}
                max={item.max}
                className="w-20"
              />
            )}
            {item.type === "locale" && (
              <Select
                value={props[item.key] as string}
                onValueChange={(value) => onPropsChange(item.key, value)}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="zh-TW">Chinese (TW)</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Playground() {
  const [monthProps, setMonthProps] = useState<MonthProps>({
    continuousMonths: true,
    hasEmptyColumn: false,
    weekStart: 0,
    maxLevel: 4,
    blockSize: 12,
    blockMargin: 4,
    blockRadius: 2,
    locale: "en",
  });

  const [weekProps, setWeekProps] = useState<WeekProps>({
    weekStart: 0,
    use12Hour: false,
    maxLevel: 4,
    blockSize: 12,
    blockMargin: 4,
    blockRadius: 2,
    locale: "en",
  });

  const [dateProps, setDateProps] = useState<DateProps>({
    use12Hour: false,
    maxLevel: 4,
    blockSize: 12,
    blockMargin: 4,
    blockRadius: 2,
    locale: "en",
  });

  const updateMonthProps = (key: keyof MonthProps, value: unknown) => {
    setMonthProps((prev) => ({ ...prev, [key]: value }));
  };

  const updateWeekProps = (key: keyof WeekProps, value: unknown) => {
    setWeekProps((prev) => ({ ...prev, [key]: value }));
  };

  const updateDateProps = (key: keyof DateProps, value: unknown) => {
    setDateProps((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Tabs defaultValue="month" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="month">Month</TabsTrigger>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="date">Date</TabsTrigger>
      </TabsList>

      <TabsContent value="month" className="mt-6">
        <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
          <div className="overflow-x-auto rounded-lg border bg-card p-6">
            <MonthPlayground props={monthProps} />
          </div>
          <div className="rounded-lg border bg-card p-6">
            <ControlPanel
              props={monthProps}
              onPropsChange={updateMonthProps}
              config={[
                { key: "continuousMonths", label: "Continuous Months", type: "boolean" },
                { key: "hasEmptyColumn", label: "Empty Column", type: "boolean" },
                { key: "weekStart", label: "Week Start", type: "number", min: 0, max: 6 } as const,
                { key: "maxLevel", label: "Max Level", type: "number", min: 1, max: 10 },
                { key: "blockSize", label: "Block Size", type: "number", min: 8, max: 24 },
                { key: "blockMargin", label: "Block Margin", type: "number", min: 0, max: 8 },
                { key: "blockRadius", label: "Block Radius", type: "number", min: 0, max: 8 },
                { key: "locale", label: "Locale", type: "locale" },
              ]}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="week" className="mt-6">
        <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
          <div className="overflow-x-auto rounded-lg border bg-card p-6">
            <WeekPlayground props={weekProps} />
          </div>
          <div className="rounded-lg border bg-card p-6">
            <ControlPanel
              props={weekProps}
              onPropsChange={updateWeekProps}
              config={[
                { key: "use12Hour", label: "12-Hour Format", type: "boolean" },
                { key: "weekStart", label: "Week Start", type: "number", min: 0, max: 6 } as const,
                { key: "maxLevel", label: "Max Level", type: "number", min: 1, max: 10 },
                { key: "blockSize", label: "Block Size", type: "number", min: 8, max: 24 },
                { key: "blockMargin", label: "Block Margin", type: "number", min: 0, max: 8 },
                { key: "blockRadius", label: "Block Radius", type: "number", min: 0, max: 8 },
                { key: "locale", label: "Locale", type: "locale" },
              ]}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="date" className="mt-6">
        <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
          <div className="overflow-x-auto rounded-lg border bg-card p-6">
            <DatePlayground props={dateProps} />
          </div>
          <div className="rounded-lg border bg-card p-6">
            <ControlPanel
              props={dateProps}
              onPropsChange={updateDateProps}
              config={[
                { key: "use12Hour", label: "12-Hour Format", type: "boolean" },
                { key: "maxLevel", label: "Max Level", type: "number", min: 1, max: 10 },
                { key: "blockSize", label: "Block Size", type: "number", min: 8, max: 24 },
                { key: "blockMargin", label: "Block Margin", type: "number", min: 0, max: 8 },
                { key: "blockRadius", label: "Block Radius", type: "number", min: 0, max: 8 },
                { key: "locale", label: "Locale", type: "locale" },
              ]}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
