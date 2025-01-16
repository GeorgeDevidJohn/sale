import connectDB from "@/lib/mongodb"; // Database connection
import Sales from "@/models/salesmodel"; // Sales model
import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format } from "date-fns";

await connectDB();

export async function GET(req) {
  try {
    // Get the current month and year
    const currentDate = new Date();
    const month = currentDate.getMonth(); // 0-indexed
    const year = currentDate.getFullYear();

    // Define the start and end of the current month
    const startOfSelectedMonth = startOfMonth(new Date(year, month));
    const endOfSelectedMonth = endOfMonth(new Date(year, month));

    // Fetch sales data grouped by product and weeks in the current month
    const sales = await Sales.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfSelectedMonth,
            $lte: endOfSelectedMonth,
          },
        },
      },
      {
        $group: {
          _id: {
            product: "$productName", // Replace with your product field name
            year: { $year: "$createdAt" },
            week: { $week: "$createdAt" },
          },
          totalSales: { $sum: "$count" },
          minDate: { $min: "$createdAt" }, // Get the earliest date in the week
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.week": -1,
        },
      },
    ]);

    // Map the response to include week ranges and product-specific sales
    const formattedSales = sales.map((sale) => {
      const startDate = startOfWeek(sale.minDate, { weekStartsOn: 1 }); // Week starts on Monday
      const endDate = endOfWeek(sale.minDate, { weekStartsOn: 1 });
      const weekRange = `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`;
      return {
        product: sale._id.product,
        week: weekRange,
        totalSales: sale.totalSales,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedSales,
    });
  } catch (error) {
    console.error("Error fetching product sales data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product sales data", message: error.message },
      { status: 500 }
    );
  }
}
