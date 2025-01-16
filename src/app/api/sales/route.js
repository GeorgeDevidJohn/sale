import connectDB from "@/lib/mongodb"; // Import database connection
import Sales from "@/models/salesmodel"; // Import the Sales model
import { NextResponse } from "next/server";

// Ensure database connection is awaited
await connectDB();

/**
 * POST: Add a new sale
 */
export async function POST(request) {
  try {
    // Parse request body
    const reqBody = await request.json();
    const {productid, productName, count } = reqBody;

    // Validate input fields
    if (!productid || !productName || count == null) {
      return NextResponse.json(
        { error: "All fields (productid, productName, count) are required" },
        { status: 400 }
      );
    }

    // Create a new sale instance
    const newSale = new Sales({
      productid,
      productName,
      count,
    });

    // Save the new sale to the database
    const savedSale = await newSale.save();

    return NextResponse.json({
      message: "Sale added successfully",
      success: true,
      sale: savedSale,
    });
  } catch (error) {
    console.error("Error adding sale:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET: Fetch all sales
 */
export async function GET() {
  try {
    // Fetch all sales from the database
    const sales = await Sales.find();

    return NextResponse.json({
      message: "Sales fetched successfully",
      success: true,
      sales: sales.map((sale) => ({
        id: sale._id,
        productid: sale.productid,
        productName: sale.productName,
        count: sale.count,
        createdAt: sale.createdAt,
        updatedAt: sale.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove a sale by ID
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // Expecting ?id=<saleId>

    if (!id) {
      return NextResponse.json(
        { error: "Sale ID is required" },
        { status: 400 }
      );
    }

    const deletedSale = await Sales.findByIdAndDelete(id);

    if (!deletedSale) {
      return NextResponse.json(
        { error: "Sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Sale deleted successfully",
      success: true,
      sale: deletedSale,
    });
  } catch (error) {
    console.error("Error deleting sale:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update a sale by ID
 */
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // Expecting ?id=<saleId>

    if (!id) {
      return NextResponse.json(
        { error: "Sale ID is required" },
        { status: 400 }
      );
    }

    const reqBody = await request.json();
    const { userid, productid, productName, count } = reqBody;

    if (!userid && !productid && !productName && count == null) {
      return NextResponse.json(
        { error: "At least one field (userid, productid, productName, count) must be provided for update" },
        { status: 400 }
      );
    }

    const updatedSale = await Sales.findByIdAndUpdate(
      id,
      { userid, productid, productName, count },
      { new: true } // Return the updated document
    );

    if (!updatedSale) {
      return NextResponse.json(
        { error: "Sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Sale updated successfully",
      success: true,
      sale: updatedSale,
    });
  } catch (error) {
    console.error("Error updating sale:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
