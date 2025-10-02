"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart"

const chartConfig = {
  users: {
    label: "New Users",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

type ChartData = {
  name: string;
  users: number;
};

export default function UserGrowthChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/charts');
        const result = await res.json();
        // Use the new daily data from the API
        setData(result.dailyUsersData);
      } catch (error) {
        console.error("Failed to fetch area chart data", error);
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
        <CardTitle>User Growth</CardTitle>
        <CardDescription>New user sign-ups over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <AreaChart accessibilityLayer data={data}>
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
                content={<ChartTooltipContent indicator="dot" />}
              />
              <defs>
                <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-users)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-users)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="users"
                type="natural"
                fill="url(#fillUsers)"
                fillOpacity={0.4}
                stroke="var(--color-users)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center min-h-[300px]">
            <p className="text-muted-foreground">Not enough new user data to display chart.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}