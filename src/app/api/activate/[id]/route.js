import connectDB from "@/lib/mongodb"; // Import as default
import Products from "@/models/productmodel";
import { NextResponse } from "next/server";
await connectDB();
export async function PUT(request) {
    try {
        console.log("Updating product status...");

        // Parse request body
        const reqBody = await request.json();
        const _id = request.url.split('/').pop();
        console.log(request)
        const { active } = reqBody;
        console.log(reqBody)

        // Validate inputs
        if (!_id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        if (typeof active !== "boolean") {
            return NextResponse.json({ error: "'active' field must be a boolean" }, { status: 400 });
        }

        // Find and update the product's active status
        const updatedProduct = await Products.findByIdAndUpdate(
            _id,
            { active },
            { new: true, runValidators: true } // Return the updated product and run schema validators
        );

        if (!updatedProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        console.log("Product status updated successfully");
        return NextResponse.json({
            message: "Product status updated successfully",
            success: true,
            updatedProduct
        });

    } catch (error) {
        console.error("Error updating product status:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}