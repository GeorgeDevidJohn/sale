import connectDB from "@/lib/mongodb"; // Import database connection
import Sales from "@/models/salesmodel"; // Import the Sales model
import Products from "@/models/productmodel"; // Import the Product model
import { NextResponse } from "next/server";
import { parse } from "url"; // Import the URL parser

// Ensure database connection is awaited
await connectDB();

/**
 * PUT: Update a sale by ID and adjust the sold count on the Product table
 */
export async function PUT(request) {
  try {
    // Extract the `id` query parameter
    const { query } = parse(request.url, true); // Use the URL parser
    const saleid = query.id;

    if (!saleid) {
      return NextResponse.json(
        { error: "Sale ID is required" },
        { status: 400 }
      );
    }

    const reqBody = await request.json();
    const { count, productid } = reqBody;

    if (count == null || isNaN(count) || count < 0) {
      return NextResponse.json(
        { error: "Valid count is required" },
        { status: 400 }
      );
    }

    // Fetch the existing sale
    const existingSale = await Sales.findById(saleid);
    if (!existingSale) {
      return NextResponse.json(
        { error: "Sale not found" },
        { status: 404 }
      );
    }

    const oldCount = existingSale.count;

    console.log("oldCount: " + oldCount);

    const difference = count - oldCount;
    console.log("difference: " + difference);

    // Update the sales count
    const updatedSale = await Sales.findByIdAndUpdate(
      saleid,
      { count },
      { new: true } // Return the updated document
    );

    // Adjust the sold count in the Product table
    const product = await Products.findById(productid);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Update the sold count based on the difference
    const newSoldCount = product.sold + difference;
    const newCount = product.count - difference;

    // Ensure sold count doesn't go below zero
    if (newSoldCount < 0) {
      return NextResponse.json(
        { error: "Sold count cannot be negative" },
        { status: 400 }
      );
    }

    const updatedProduct = await Products.findByIdAndUpdate(
      productid,
      { count: newCount, sold: newSoldCount },
      { new: true } // Return the updated document
    );

    return NextResponse.json({
      message: "Sale and Product sold count updated successfully",
      success: true,
      sale: updatedSale,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating sale and product:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
