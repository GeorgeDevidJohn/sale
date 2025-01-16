import connectDB from "@/lib/mongodb";
import Products from "@/models/productmodel";
import { NextResponse } from "next/server";

// Ensure the database connection is established
await connectDB();

export async function PUT(req) {
  try {
    const { productid, count } = await req.json(); // Parse the request body

    if (!productid || !count || typeof count !== "number") {
      return NextResponse.json(
        { success: false, message: "Invalid product ID or count value" },
        { status: 400 }
      );
    }

    // Find the product by productid
    const product = await Products.findOne({ _id: productid });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Update the product count
    product.count -= count;
    product.sold += count;
    await product.save();

    // Return a success response
    return NextResponse.json({
      success: true,
      message: "Product count updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product count:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating the product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
