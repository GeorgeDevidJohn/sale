"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";
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
import { format, getMonth, getYear, startOfMonth } from "date-fns";
import ProductMonth from "@/components/productmonth";
import Productperday from "@/components/productperday";
import RevenueCard from "@/components/profit";
import NavigationButtons from "@/components/nav";
import getUser from "@/lib/getuser";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

export default function SalesChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUser] = useState("");

  const fetchData = async (month, year) => {
    try {
      const response = await fetch(`/api/monthsale?month=${month}&year=${year}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const formattedData = data.data.map((item, index) => ({
        week: `Week ${index + 1}`,
        totalSales: item.totalSales,
      }));
      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const users = await getUser();
      setUser(users);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    async function initialize() {
      try {
        await getUserData(); // Fetch user data
        const currentDate = new Date();
        const month = getMonth(currentDate) + 1; // Months are 0-indexed
        const year = getYear(currentDate);
        await fetchData(month, year); // Fetch chart data
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    }
    initialize();
  }, []);

  const currentMonth = format(startOfMonth(new Date()), "MMMM yyyy");

  return (
    <>
      <NavigationButtons />
      <div className="flex min-h-full flex-col justify-center px-6 pt-16 lg:px-8">
        <span className="text-gray-200  font-bold text-2xl">
          HI {userData.fullName}!
        </span>
        <RevenueCard />
        <div className="sm:mx-auto sm:w-full sm:max-w-6xl">
          <Card className="mt-4 border-none bg-[#202020bd]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">
                    Sales Data for {currentMonth}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Total sales for the current month
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{ left: 6, right: 6 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="week"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      dataKey="totalSales"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" hideLabel />}
                    />
                    <Area
                      dataKey="totalSales"
                      type="linear"
                      fill="var(--color-desktop)"
                      fillOpacity={0.4}
                      stroke="var(--color-desktop)"
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-white font-medium leading-none">
                    Overall trend for {currentMonth}
                    <TrendingUp className="h-4 w-4 text-green-300" />
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="flex min-h-full flex-col justify-center px-6   lg:px-1">
        <div className="sm:mx-auto sm:w-full sm:max-w-6xl">
          <ProductMonth />
        </div>
      </div>
      <div className="flex min-h-full flex-col justify-center px-6  lg:px-1">
        <div className="sm:mx-auto sm:w-full pb-20 sm:max-w-6xl">
          <Productperday />
        </div>
      </div>
    </>
  );
}
