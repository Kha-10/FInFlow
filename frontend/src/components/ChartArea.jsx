import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
  desktop: {
    label: "Desktop",
    color: "rgb(255, 59, 59)",
  },
  mobile: {
    label: "Mobile",
    color: "rgb(46, 150, 255)",
  },
};

export default function ChartArea() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[200px]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            {/* <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            /> */}
            <ChartTooltip
              cursor={false}
              content={({ payload, label, active }) => {
                if (!active || !payload?.length) return null;

                const sortedPayload = [...payload].sort((a, b) =>
                  a.dataKey === "mobile" ? 1 : b.dataKey === "mobile" ? -1 : 0
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
            />

            <Area
              dataKey="mobile"
              type="monotone"
              fill="rgba(255, 59, 59, 0.2)"
              fillOpacity={0.3}
              stroke="rgb(255, 59, 59)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="monotone"
              fill="rgba(46, 150, 255, 0.2)"
              fillOpacity={0.3}
              stroke="rgb(46, 150, 255)"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
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
      </CardFooter>
    </Card>
  );
}