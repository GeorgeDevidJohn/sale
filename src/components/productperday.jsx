"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // ShadCN Calendar
import { cn } from "@/lib/utils";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
};

export default function Productperday() {
  const [chartData, setChartData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Start as null
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  // Fetch product sales data by date or for all dates
  const fetchProductData = async (date) => {
    try {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : null;
      const query = formattedDate ? `?date=${formattedDate}` : ""; // Add query if date is provided
      const response = await fetch(`/api/productperday${query}`, { method: "GET" });
      const data = await response.json();

      if (data.success) {
        const formattedData = data.sales.map((item) => ({
          month: item._id, // Product name or identifier
          desktop: item.totalSales, // Total sales
        }));
        setChartData(formattedData);
      } else {
        console.error("Failed to fetch product data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  // Fetch data on mount and when selectedDate changes
  useEffect(() => {
    fetchProductData(selectedDate);
  }, [selectedDate]);

  return (
    <Card className="mt-4 bg-[#202020bd] border-none">
      <CardHeader>
        <CardTitle className="text-white">Product Sales Per Day</CardTitle>
        <CardDescription className="text-gray-600">
          Sales data for{" "}
          {selectedDate
            ? format(selectedDate, "PPP")
            : "all dates"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                
                className={cn( 
                  "w-[240px] justify-start !bg-[#000000bf] text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 backdrop-blur-md  bg-[#ffffffb8] border-none " align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <XAxis dataKey="desktop" type="number" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="desktop"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="desktop"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-white text-muted-foreground">
          Showing total sales for{" "}
          {selectedDate ? format(selectedDate, "PPP") : "all dates"}
        </div>
      </CardFooter>
    </Card>
  );
}
