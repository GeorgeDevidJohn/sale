import connectDB from "@/lib/mongodb"; // Database connection
import Sales from "@/models/salesmodel"; // Sales model
import { NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";

// Ensure the database connection is awaited
await connectDB();
export async function GET(req) {
  try {
    // Parse query parameters for the date
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date"); // Expecting format "YYYY-MM-DD"

    let filter = {};
    if (date) {
      filter = {
        $expr: {
          $eq: [
            { $substr: ["$createdAt", 0, 10] }, // Extract "YYYY-MM-DD" part from the ISO date string
            date,
          ],
        },
      };
    }

    let sales;
    if (date) {
      // Fetch total sales grouped by product for the specified date
      sales = await Sales.aggregate([
        {
          $match: filter,
        },
        {
          $group: {
            _id: "$productName", // Group by productName
            totalSales: { $sum: "$count" }, // Sum up the count for each product
          },
        },
        {
          $sort: { totalSales: -1 }, // Sort by total sales in descending order
        },
      ]);
    } else {
      // Fetch total sales grouped by product across all records
      sales = await Sales.aggregate([
        {
          $group: {
            _id: "$productName", // Group by productName
            totalSales: { $sum: "$count" }, // Sum up the count for each product
          },
        },
        {
          $sort: { totalSales: -1 }, // Sort by total sales in descending order
        },
      ]);
    }

    // Return the response
    return NextResponse.json({
      success: true,
      date: date || "all-time", // Indicate if it's an all-time summary
      sales,
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sales data", message: error.message },
      { status: 500 }
    );
  }
}
