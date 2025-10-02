"use client";

import { useState, useEffect } from 'react';
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

// --- FIX for Error 1: Add an index signature to ChartConfig ---
// This tells TypeScript that besides 'count', our config can have any other string as a key.
type DynamicChartConfig = ChartConfig & {
  [key: string]: {
    label: string;
    color?: string;
  };
};

const initialChartConfig: DynamicChartConfig = {
  count: {
    label: "Ads",
  },
  // We will add dynamic properties like 'tech', 'crypto', etc., here
};

// --- FIX for Error 2: Define a type for our data objects ---
type PieChartData = {
  name: string;
  value: number;
  fill: string;
};

export default function AdsPieChart() {
  // Apply the type to useState
  const [data, setData] = useState<PieChartData[]>([]);
  const [dynamicConfig, setDynamicConfig] = useState<DynamicChartConfig>(initialChartConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/charts');
        const result = await res.json();
        
        const newConfig = { ...initialChartConfig };
        const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

        // The fetched data is now correctly typed
        const formattedData: PieChartData[] = result.categoryData.map((item: { name: string; value: number }, index: number) => {
          const key = item.name.toLowerCase().replace(/[^a-z0-9]/g, ''); // Sanitize key
          newConfig[key] = { label: item.name, color: COLORS[index % COLORS.length] };
          return { ...item, fill: `var(--color-${key})` };
        });

        setData(formattedData);
        setDynamicConfig(newConfig);
      } catch (error) {
        console.error("Failed to fetch pie chart data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // This line now works because `data` is correctly typed as `PieChartData[]`
  const totalAds = data.reduce((acc, curr) => acc + curr.value, 0);

  if (isLoading) return <Card><CardHeader><CardTitle>Loading...</CardTitle></CardHeader></Card>;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Ads by Category</CardTitle>
        <CardDescription>Distribution of all ads</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={dynamicConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
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
                        <tspan className="fill-foreground text-3xl font-bold">
                          {totalAds.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          dy="1.2em"
                          className="fill-muted-foreground"
                        >
                          Total Ads
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
      <div className="flex-1 flex flex-col justify-end p-6 pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-green-500" />
          Marketplace is growing
        </div>
      </div>
    </Card>
  );
}