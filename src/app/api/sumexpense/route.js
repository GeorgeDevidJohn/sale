import connectDB from "@/lib/mongodb"; // Ensure database connection is handled
import Expense from "@/models/expenesemodel"; // Import the Expense model
import { NextResponse } from "next/server";

connectDB();

// Retrieve the total sum of all expenses
export async function GET() {
  try {
    console.log("Calculating total expense sum...");

    // Aggregate to calculate the total sum
    const totalExpense = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $toDouble: "$amount" } }, // Convert string to number and sum up
        },
      },
    ]);

    const total = totalExpense.length > 0 ? totalExpense[0].totalAmount : 0;

    console.log("Total expense sum calculated:", total);

    return NextResponse.json({
      message: "Total expense sum calculated successfully",
      success: true,
      totalAmount: total,
    });
  } catch (error) {
    console.error("Error calculating total expense sum:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
