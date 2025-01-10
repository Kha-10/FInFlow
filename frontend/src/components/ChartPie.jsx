import React, { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "./ui/button";
import { useSearchParams } from "react-router-dom";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "rgb(46, 150, 255)",
  },
  safari: {
    label: "Safari",
    color: "rgb(255, 100, 59)",
  },
  firefox: {
    label: "Firefox",
    color: "rgb(255, 184, 0)",
  },
  edge: {
    label: "Edge",
    color: "rgb(0, 210, 255)",
  },
  other: {
    label: "Other",
    color: "rgb(255, 102, 255)",
  },
};

const generateColor = (index) => {
  const hue = (index * 137.508) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

export default function ChartPie({ chartPie }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "outcome";
  const totalExpenses = useMemo(() => {
    return chartPie.reduce((acc, curr) => acc + curr?.total, 0);
  }, [chartPie]);

  const chartConfig = useMemo(() => {
    const config = {
      total: { label: "Total" },
    };
    chartPie.forEach((item, index) => {
      config[item.category.toLowerCase()] = {
        label: item.category,
        color: generateColor(index),
      };
    });
    return config;
  }, [chartPie]);

  const chartData = useMemo(() => {
    return chartPie.map((item, index) => ({
      ...item,
      fill: generateColor(index),
    }));
  }, [chartPie,sortBy]);

  const handleChange = (data) => {
    console.log("data",data);
    searchParams.set("sortBy", data);
    setSearchParams(searchParams);
  };

  return (
    // <Card className=" xl:w-[560px] xl:h-[378px] w-full flex flex-col">
    <Card className="w-full flex flex-col bg-white dark:bg-gray-800">
      <CardHeader className="pb-0">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle>Financial Breakdown</CardTitle>
            <CardDescription>
              {sortBy === "income" ? "Income" : "Outcome"} Distribution
            </CardDescription>
          </div>
          <div
            className="inline-flex items-center rounded-md  border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-1 w-fit"
            role="group"
            aria-label="Toggle between income and outcome view"
          >
            <Button
              variant={sortBy === "income" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleChange("income")}
              className={`transition-colors ${
                sortBy === "income"
                  ? "bg-white dark:bg-gray-800 text-foreground border border-gray-200 dark:border-gray-600 hover:bg-primary-foreground shadow-sm"
                  : "hover:bg-background/50 hover:text-foreground"
              }`}
            >
              Income
            </Button>
            <Button
              variant={sortBy === "outcome" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleChange("outcome")}
              className={`transition-colors ${
                sortBy === "outcome"
                  ? "bg-white dark:bg-gray-800 text-foreground border border-gray-200 dark:border-gray-600 hover:bg-primary-foreground shadow-sm"
                  : "hover:bg-background/50 hover:text-foreground"
              }`}
            >
              Outcome
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square lg:h-[248px] h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalExpenses.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total {sortBy === "income" ? "Income" : "Outcome"}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total {sortBy === "income" ? "Income" : "Outcome"}: $
          {totalExpenses.toLocaleString()}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing distribution of{" "}
          {sortBy === "income" ? "income" : "outcome"} categories
        </div>
      </CardFooter>
    </Card>
  );
}
