import connectDB from "@/lib/mongodb"; // Ensure database connection is handled
import Logs from "@/models/logsmodel"; // Import the Logs model
import { CodeSquare } from "lucide-react";
import { NextResponse } from "next/server";

await connectDB();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date"); // Expected in "YYYY-MM-DD" format
    
    let filter = {};
    if (date) {
      filter = {
        $expr: {
          $eq: [
            { $substr: ["$createdAt", 0, 10] }, // Extract "YYYY-MM-DD" part from the ISO date string
            date,
          ],
        },
      };
    }
    console.log(filter)
    // Retrieve logs from the database based on the filter
    const logs = await Logs.find(filter);

    return NextResponse.json({
      message: "Logs fetched successfully",
      success: true,
      logs,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
