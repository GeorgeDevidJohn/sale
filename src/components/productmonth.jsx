"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function ProductMonth() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartConfig, setChartConfig] = useState({});

  // Fetch data from the API
  const fetchSalesData = async () => {
    try {
      const response = await fetch(`/api/productmonth`, { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }
      const data = await response.json();

      // Extract unique products and weeks
      const products = [...new Set(data.data.map((item) => item.product))];
      const weeks = [...new Set(data.data.map((item) => item.week))];

      // Create chart configuration for each product
      const config = {};
      products.forEach((product, index) => {
        config[product] = {
          label: product,
          color: `hsl(var(--chart-${index + 1}))`, // Use different chart colors
        };
      });

      // Prepare the chart data
      const formattedData = weeks.map((week) => {
        const weekData = { week };
        products.forEach((product) => {
          // Find the sales for the current product and week
          const productSales = data.data.find(
            (item) => item.week === week && item.product === product
          );
          weekData[product] = productSales ? productSales.totalSales : 0; // Default to 0 if no sales data
        });
        return weekData;
      });

      setChartConfig(config);
      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  return (
    <Card className="mt-4 bg-[#202020bd] border-none">
      <CardHeader>
        <CardTitle className="text-white">Weekly Product Sales</CardTitle>
        <CardDescription className="text-gray-600">{new Date().toLocaleString("default", { month: "long", year: "numeric" })}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}`} // Format Y-axis values
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              {Object.keys(chartConfig).map((product) => (
                <Line
                  key={product}
                  dataKey={product}
                  type="monotone"
                  stroke={chartConfig[product].color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium  text-white leading-none">
              Sales trend for the current month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 text-gray-600 leading-none text-muted-foreground">
              Showing total sales of products by week
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
