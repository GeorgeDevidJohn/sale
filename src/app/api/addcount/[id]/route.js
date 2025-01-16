import connectDB from "@/lib/mongodb";
import Products from "@/models/productmodel";
import { NextResponse } from "next/server";

// Ensure database connection is awaited
await connectDB();

export async function PUT(req) {
    try {
        const id = req.url.split('/').pop(); // Extract product ID from the URL
        const { count } = await req.json(); // Parse the request body

        if (!count || typeof count !== "number") {
            return NextResponse.json({ success: false, message: "Invalid count value" }, { status: 400 });
        }

        // Find the product by ID
        const product = await Products.findById(id);

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        // Update the product count
        product.count += count;
        await product.save();

        // Return a success response
        return NextResponse.json({
            success: true,
            message: "Product count updated successfully",
            product,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while updating the product",
            error: error.message,
        }, { status: 500 });
    }
}
