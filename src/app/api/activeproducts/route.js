import connectDB from "@/lib/mongodb"; // Import as default
import Products from "@/models/productmodel";
import { NextResponse } from "next/server";

// Ensure database connection is awaited
await connectDB();
export async function GET() {
    try {
      console.log("Fetching active products");
  
      // Fetch only active products from the database
      const activeProducts = await Products.find({ active: true });
      console.log("Active products fetched successfully", activeProducts);
  
      // Return the list of active products
      return NextResponse.json({
        message: "Active products fetched successfully",
        success: true,
        products: activeProducts,
      });
    } catch (error) {
      // Handle errors
      console.error("Error fetching active products:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }