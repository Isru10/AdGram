"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart"

const chartConfig = {
  total: {
    label: "New Ads",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function AdsBarChart() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/charts');
        const result = await res.json();
        // Use the new daily data from the API
        setData(result.dailyAdsData);
      } catch (error) {
        console.error("Failed to fetch bar chart data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <Card><CardHeader><CardTitle>Loading...</CardTitle></CardHeader></Card>;

  return (
    <Card>
      <CardHeader>
        {/* Updated title and description */}
        <CardTitle>New Ads Posted</CardTitle>
        <CardDescription>Last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false}/>
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="total" fill="var(--color-total)" radius={8} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center min-h-[300px]">
            <p className="text-muted-foreground">Not enough new ad data to display chart.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}