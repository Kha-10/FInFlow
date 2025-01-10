import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  //   ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  income: {
    label: "income",
    color: "rgb(255, 59, 59)",
  },
  outcome: {
    label: "outcome",
    color: "rgb(46, 150, 255)",
  },
};

const chartColors = {
  income: {
    stroke: "rgb(46, 150, 255)",
    fill: "rgba(46, 150, 255, 0.2)",
  },
  outcome: {
    stroke: "rgb(255, 59, 59)",
    fill: "rgba(255, 59, 59, 0.2)",
  },
};

export default function ChartArea({
  chartDatas,
  filterRangeBy,
  dayChartDatas,
  dateRange,
}) {
  const CustomTooltip = ({ payload, label, active }) => {
    if (!active || !payload?.length) return null;
    const sortedPayload = [...payload].sort((a, b) =>
      a.dataKey === "outcome" ? 1 : b.dataKey === "outcome" ? -1 : 0
    );

    return (
      <div className="tooltip-container p-2 bg-accent shadow-md rounded-md">
        <p className="font-bold mb-1">{label}</p>
        {sortedPayload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="block rounded-sm"
              style={{
                backgroundColor: chartColors[entry.dataKey].stroke,
                width: 8,
                height: 8,
              }}
            />
            <span className="capitalize text-foreground">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };
  const filteredData = useMemo(() => {
    switch (filterRangeBy) {
      case "last-month":
      case "this-month":
        return dayChartDatas && dayChartDatas.length > 0 ? dayChartDatas : [];
      case "last-3-months":
        return chartDatas?.slice(-3);
      case "last-6-months":
        return chartDatas?.slice(-6);
      case "this-year":
      //   return chartDatas.slice(-6);
      case "last-year":
        return chartDatas;
      default:
        if (!filterRangeBy && dateRange) {
          return dayChartDatas && dayChartDatas.length > 0
            ? dayChartDatas
            : chartDatas;
        }
        return chartDatas;
    }
  }, [filterRangeBy, dayChartDatas, chartDatas]);

  return (
    <Card className="w-full bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>
          Showing total Income and Outcome for{" "}
          {filterRangeBy !== "this-month" ? "the" : ""}{" "}
          {filterRangeBy?.replaceAll("-", " ")}
          {!filterRangeBy && "the whole year"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[200px]">
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke="hsl(0, 0%, 50%, 0.2)" />
            <XAxis
              //   dataKey="month"
              dataKey={
                filterRangeBy === "last-month" ||
                filterRangeBy === "this-month" ||
                dayChartDatas?.length > 0
                  ? "day"
                  : "month"
              }
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              padding={{ left: 20, right: 20 }}
              //   tickFormatter={(value) => value.slice(0, 3)}
              tickFormatter={(value) => value}
              // interval={
              //   filterRangeBy === "last-month" || filterRangeBy === "this-month"
              //     ? 0
              //     : "preserveStartEnd"
              // }
              interval={"preserveStartEnd"}
              tick={({ x, y, payload }) => (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={0}
                    y={-2}
                    dy={16}
                    textAnchor="middle"
                    fill="#666"
                    fontSize="12px"
                  >
                    {payload.value}
                  </text>
                </g>
              )}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
              padding={{ top: 0 }}
            />
            {/* <Tooltip
              cursor={false}
              content={({ payload, label, active }) => {
                if (!active || !payload?.length) return null;
                const sortedPayload = [...payload].sort((a, b) =>
                  a.dataKey === "outcome" ? 1 : b.dataKey === "outcome" ? -1 : 0
                );

                return (
                  <div className="tooltip-container p-2 bg-accent shadow-md rounded-md">
                    <p className="font-bold mb-1">{label}</p>
                    {sortedPayload.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span
                          className="block"
                          style={{
                            backgroundColor: entry.color,
                            width: 8,
                            height: 8,
                          }}
                        />
                        <span className="capitalize text-foreground">
                          {entry.name}: {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            /> */}
            <Tooltip cursor={false} content={CustomTooltip} />

            <Area
              dataKey="income"
              type="monotone"
              fill={chartColors.income.fill}
              fillOpacity={0.3}
              stroke={chartColors.income.stroke}
              strokeWidth={2}
              //   stackId="a"
            />
            <Area
              dataKey="outcome"
              type="monotone"
              fill={chartColors.outcome.fill}
              fillOpacity={0.3}
              stroke={chartColors.outcome.stroke}
              strokeWidth={2}
              //   stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}
