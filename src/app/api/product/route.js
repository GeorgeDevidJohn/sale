import connectDB from "@/lib/mongodb"; // Import as default
import Products from "@/models/productmodel";
import { NextResponse } from "next/server";

// Ensure database connection is awaited
await connectDB();

export async function POST(request) {
    try {
        console.log("step 1");
        // Parse request body
        const reqBody = await request.json();
        const { productName, costPrice, salePrice, count, active } = reqBody;
         console.log("step 6");
        // Create new product instance
        const newProduct = new Products({
            productName, costPrice, salePrice, count,sold:0, active
        });
        console.log("step 2");
        console.log(newProduct);

        // Save the new product to the database
        const savedProduct = await newProduct.save();
        console.log("step 3");
        return NextResponse.json({
            message: "Product created successfully",
            success: true,
            savedProduct
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function GET() {
    try {
        console.log("Fetching products");

        // Fetch all products from the database
        const products = await Products.find({});
        console.log("Products fetched successfully", products);

        // Return the list of products
        return NextResponse.json({
            message: "Products fetched successfully",
            success: true,
            products
        });
    } catch (error) {
        // Handle errors
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function PUT(request) {
    try {
        console.log("Updating product...");

        // Parse request body
        const reqBody = await request.json();
        const { _id, productName, costPrice, salePrice, count } = reqBody;

        if (!_id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        // Find and update the product
        const updatedProduct = await Products.findByIdAndUpdate(
            _id,
            { productName, costPrice, salePrice, count },
            { new: true, runValidators: true }  // Return the updated product and run schema validators
        );

        if (!updatedProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        console.log("Product updated successfully");
        return NextResponse.json({
            message: "Product updated successfully",
            success: true,
            updatedProduct
        });

    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



