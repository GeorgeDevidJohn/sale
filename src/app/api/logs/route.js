import connectDB from "@/lib/mongodb"; // Ensure database connection is handled
import Logs from "@/models/logsmodel"; // Import the Logs model
import { formatDate } from "date-fns";
import { NextResponse } from "next/server";

await connectDB();

export async function POST(request) {
  try {
    console.log("Adding a new log...");

    // Parse request body
    const reqBody = await request.json();
    const { name, role, message } = reqBody;

    if (!name || !role || !message) {
      return NextResponse.json(
        { error: "Name, role, and message are required" },
        { status: 400 }
      );
    }

    const newLog = new Logs({
      name,
      role,
      message
    });

    // Save the log entry to the database
    const savedLog = await newLog.save();
    console.log("Log created successfully:", savedLog);

    return NextResponse.json({
      message: "Log created successfully",
      success: true,
      savedLog,
    });
  } catch (error) {
    console.error("Error adding log:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
    try {
      console.log("Fetching logs...");
  
      // Retrieve logs from the database
      const logs = await Logs.find({}).sort({ createdAt: -1 }); // Sort by date, most recent first
  
      console.log("Logs fetched successfully:", logs);
  
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

 
  