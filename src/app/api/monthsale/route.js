import connectDB from "@/lib/mongodb"; // Database connection
import Sales from "@/models/salesmodel"; // Sales model
import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format } from "date-fns";

// Ensure the database connection is awaited
await connectDB();

export async function GET(req) {
  try {
    // Parse query parameters for month and year
    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month")); // 1-12
    const year = parseInt(searchParams.get("year")); // e.g., 2023

    if (!month || !year) {
      return NextResponse.json(
        { success: false, error: "Missing month or year parameter" },
        { status: 400 }
      );
    }

    // Define the start and end of the specified month
    const startOfSelectedMonth = startOfMonth(new Date(year, month - 1));
    const endOfSelectedMonth = endOfMonth(new Date(year, month - 1));

    // Fetch sales data grouped by weeks in the specified month
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

    // Calculate the total sales for the entire month
    const totalSalesForMonth = sales.reduce(
      (total, sale) => total + sale.totalSales,
      0
    );

    // Map the response to include week numbers (e.g., Week 1, Week 2)
    const formattedSales = sales.map((sale, index) => {
      const weekNumber = `Week ${index + 1}`;
      const startDate = startOfWeek(sale.minDate, { weekStartsOn: 1 }); // Week starts on Monday
      const endDate = endOfWeek(sale.minDate, { weekStartsOn: 1 });
      const weekRange = `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`;
      return {
        weekNumber,
        weekRange,
        totalSales: sale.totalSales,
      };
    });

    return NextResponse.json({
      success: true,
      totalSalesForMonth, // Include total sales of the month
      data: formattedSales,
    });
  } catch (error) {
    console.error("Error fetching monthly sales data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch monthly sales data", message: error.message },
      { status: 500 }
    );
  }
}
