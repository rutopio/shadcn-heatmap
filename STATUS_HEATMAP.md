# StatusHeatmap 組件

一個類似 Atlassian Statuspage 的狀態指示器組件，用豎直的 block 顯示過去 90 天（或任意天數）的狀態資料。

## 特點

- ✅ 固定 4 種狀態：no-data、error、warning、normal
- ✅ 水平排列的時間線視圖
- ✅ 每天一個豎直的細長條 (vertical bar)
- ✅ 可自定義 error、warning、normal 的顏色
- ✅ 顯示 normal 天數統計
- ✅ 支持日期標籤
- ✅ 支持 Tooltip
- ✅ 支持國際化 (i18n)
- ✅ 響應式設計

## 狀態值

StatusHeatmap 使用固定的 4 種狀態值：

- `0` - **No Data** (灰色/secondary)
- `1` - **Error** (紅色/red-500)
- `2` - **Warning** (橘色/orange-500)
- `3` - **Normal** (綠色/green-500)

## 基本使用

```tsx
import {
  StatusHeatmap,
  StatusHeatmapBody,
  StatusHeatmapBlock,
  StatusHeatmapFooter,
  StatusHeatmapLegend,
  StatusHeatmapNormalDays,
} from "@/components/heatmap/status-heatmap";

const data = [
  { date: "2025-01-01", value: 3 },  // Normal
  { date: "2025-01-02", value: 3 },  // Normal
  { date: "2025-01-03", value: 2 },  // Warning
  { date: "2025-01-04", value: 1 },  // Error
  { date: "2025-01-05", value: 0 },  // No Data
  // ... 90 days
];

export default function StatusHeatmapDemo() {
  return (
    <StatusHeatmap data={data}>
      <StatusHeatmapBody>
        {({ activity, dayIndex }) => (
          <StatusHeatmapBlock
            activity={activity}
            dayIndex={dayIndex}
          />
        )}
      </StatusHeatmapBody>
      <StatusHeatmapFooter>
        <StatusHeatmapNormalDays />
        <StatusHeatmapLegend />
      </StatusHeatmapFooter>
    </StatusHeatmap>
  );
}
```

## Props

### StatusHeatmap

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `StatusActivity[]` | required | 狀態資料陣列 `{ date: 'YYYY-MM-DD', value: 0\|1\|2\|3 }[]` |
| `blockSize` | `number` | `40` | Block 高度 (px) |
| `blockSizeRatio` | `number` | `0.2` | 寬高比 (0.2 = 窄條, 1 = 正方形) |
| `blockMargin` | `number` | `2` | Block 之間的間距 |
| `blockRadius` | `number` | `2` | Block 圓角半徑 |
| `colors` | `ColorConfig` | - | 自定義顏色 `{ error?: string, warning?: string, normal?: string }` |
| `dateFormat` | `string` | `"MMM d"` | 日期格式 |
| `locale` | `Locale` | - | date-fns locale 對象 |
| `labels` | `StatusHeatmapLabels` | - | 自定義標籤文字 |

### StatusHeatmapBody

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showDateLabels` | `boolean` | `false` | 顯示日期標籤 |
| `labelInterval` | `number` | `30` | 每 N 天顯示一個標籤 |

## 範例

### 顯示日期標籤

```tsx
<StatusHeatmap data={data}>
  <StatusHeatmapBody showDateLabels labelInterval={30}>
    {({ activity, dayIndex }) => (
      <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
    )}
  </StatusHeatmapBody>
</StatusHeatmap>
```

### 自定義顏色

```tsx
<StatusHeatmap
  data={data}
  colors={{
    error: "#dc2626",    // 自定義 error 顏色
    warning: "#ea580c",  // 自定義 warning 顏色
    normal: "#16a34a",   // 自定義 normal 顏色
  }}
>
  <StatusHeatmapBody>
    {({ activity, dayIndex }) => (
      <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
    )}
  </StatusHeatmapBody>
  <StatusHeatmapFooter>
    <StatusHeatmapNormalDays />
    <StatusHeatmapLegend />
  </StatusHeatmapFooter>
</StatusHeatmap>
```

### 自定義 Block 尺寸

```tsx
<StatusHeatmap
  data={data}
  blockSize={60}
  blockSizeRatio={0.15}
  blockMargin={1}
>
  <StatusHeatmapBody>
    {({ activity, dayIndex }) => (
      <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
    )}
  </StatusHeatmapBody>
</StatusHeatmap>
```

### 使用 Tooltip

```tsx
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import type { StatusValue } from "@/components/heatmap/status-heatmap";

const STATUS_LABELS: Record<StatusValue, string> = {
  0: "No Data",
  1: "Error",
  2: "Warning",
  3: "Normal",
};

<TooltipProvider>
  <StatusHeatmap data={data}>
    <StatusHeatmapBody>
      {({ activity, dayIndex }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
          </TooltipTrigger>
          <TooltipContent>
            <p>{activity.date}</p>
            <p>{STATUS_LABELS[activity.value]}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </StatusHeatmapBody>
    <StatusHeatmapFooter>
      <StatusHeatmapNormalDays />
      <StatusHeatmapLegend />
    </StatusHeatmapFooter>
  </StatusHeatmap>
</TooltipProvider>
```

## 生成範例資料

```tsx
import { generateStatusSample } from "@/data/status-sample";

// 生成 90 天的狀態資料
// 狀態分布：約 1% no-data, 2% error, 5% warning, 92% normal
const data = generateStatusSample(42, 90);
```

## 檔案結構

- `/src/components/heatmap/status-heatmap.tsx` - 主要組件
- `/src/content/props/status.ts` - Props 定義
- `/src/data/status-sample.ts` - 範例資料生成器
- `/src/content/snippets/status.ts` - 程式碼範例
- `/src/components/landing/demos/status.tsx` - Demo 組件
- `/src/components/landing/status-showcase.tsx` - 展示頁面
- `/public/r/status-heatmap.json` - Registry 檔案

## 安裝

```bash
npx shadcn@latest add status-heatmap
```

或手動複製 `/src/components/heatmap/status-heatmap.tsx` 到你的專案中。
