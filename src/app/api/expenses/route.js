import connectDB from "@/lib/mongodb"; // Ensure database connection is handled
import Expense from "@/models/expenesemodel"; // Import the Expense model
import { NextResponse } from "next/server";

await connectDB();

// Create a new expense
export async function POST(request) {
  try {
    console.log("Adding a new expense...");

    // Parse request body
    const reqBody = await request.json();
    const { expence, amount } = reqBody;

    if (!expence || !amount) {
      return NextResponse.json(
        { error: "Expense name and amount are required" },
        { status: 400 }
      );
    }

    // Create a new expense entry
    const newExpense = new Expense({ expence, amount });

    // Save the expense to the database
    const savedExpense = await newExpense.save();
    console.log("Expense created successfully:", savedExpense);

    return NextResponse.json({
      message: "Expense created successfully",
      success: true,
      savedExpense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Retrieve all expenses
export async function GET() {
  try {
    console.log("Fetching expenses...");

    // Retrieve expenses from the database
    const expenses = await Expense.find({}).sort({ createdAt: -1 }); // Sort by creation date, most recent first

    console.log("Expenses fetched successfully:", expenses);

    return NextResponse.json({
      message: "Expenses fetched successfully",
      success: true,
      expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update an expense
export async function PUT(request) {
  try {
    console.log("Updating an expense...");

    // Parse request body
    const reqBody = await request.json();
    const { id, expence, amount } = reqBody;

    if (!id || !expence || !amount) {
      return NextResponse.json(
        { error: "ID, expense name, and amount are required" },
        { status: 400 }
      );
    }

    // Update the expense in the database
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { expence, amount },
      { new: true } // Return the updated document
    );

    if (!updatedExpense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    console.log("Expense updated successfully:", updatedExpense);

    return NextResponse.json({
      message: "Expense updated successfully",
      success: true,
      updatedExpense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete an expense
export async function DELETE(request) {
  try {
    console.log("Deleting an expense...");

    // Parse request body
    const reqBody = await request.json();
    const { id } = reqBody;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required to delete an expense" },
        { status: 400 }
      );
    }

    // Delete the expense from the database
    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    console.log("Expense deleted successfully:", deletedExpense);

    return NextResponse.json({
      message: "Expense deleted successfully",
      success: true,
      deletedExpense,
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
