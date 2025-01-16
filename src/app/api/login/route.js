import connectDB from "@/lib/mongodb"; // Import database connection
import User from "@/models/userModel"; // Import the User model
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';


// Ensure database connection is awaited
await connectDB();

export async function GET(request) {
  try {
    // Extract username and password from query parameters
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get("userName");
    const password = searchParams.get("password");

    // Validate input fields
    if (!userName || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if the user exists in the database
    const existingUser = await User.findOne({ userName });
    if (!existingUser) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // If the credentials are valid, return user details
    return NextResponse.json({
      message: "Login successful",
      success: true,
      user: {
        id: existingUser._id,
        userName: existingUser.userName,
        fullName: existingUser.fullName,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error("Error in user login:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
