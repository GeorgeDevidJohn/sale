import connectDB from "@/lib/mongodb"; // Database connection
import Products from "@/models/productmodel"; // Products model
import { NextResponse } from "next/server";

// Ensure the database connection is awaited
await connectDB();

export async function GET() {
  try {
    // Calculate the total revenue (sold * sellingPrice) for all products
    const totalRevenue = await Products.aggregate([
      {
        $project: {
          productName: 1,
          revenue: { $multiply: ["$sold", "$salePrice"] }, // Calculate revenue for each product
        },
      },
      {
        $group: {
          _id: null, // No grouping; sum up all revenues
          totalRevenue: { $sum: "$revenue" }, // Sum the revenue
        },
      },
    ]);

    // Return the response
    return NextResponse.json({
      success: true,
      totalRevenue: totalRevenue[0]?.totalRevenue || 0, // Default to 0 if no revenue
    });
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate total revenue", message: error.message },
      { status: 500 }
    );
  }
}
