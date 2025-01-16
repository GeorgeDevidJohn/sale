import connectDB from "@/lib/mongodb"; // Import database connection
import User from "@/models/userModel"; // Import the User model
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

// Ensure database connection is awaited
await connectDB();

export async function POST(request) {
  try {
    // Parse request body
    console.log(request)
    const reqBody = await request.json();
    const { fullName, userName, password } = reqBody;
     

     console.log(fullName, userName, password);
    // Validate input fields
    if (!fullName || !userName || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

   // Check if the email already exists in the database
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user instance
    const newUser = new User({
      fullName,
      userName,
      role:"employee",
      password : hashedPassword,
    });

  

    // Save the new user to the database
    const savedUser = await newUser.save();

    console.log("New user:" + savedUser);

    // Return a success response
    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      user: {
        id: savedUser._id,
        userName: savedUser.userName,
        role:savedUser.role,
        fullName: savedUser.fullName,
      },
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    return NextResponse.json(
      { error: "Internal serverddd error", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
      // Fetch all users from the database
      const users = await User.find();
  
      // Return the user data as JSON
      return NextResponse.json({
        message: "Users fetched successfully",
        success: true,
        users: users.map((user) => ({
          id: user._id,
          fullName: user.fullName,
          userName: user.userName,
          role: user.role,
          password: user.password, // For production, don't send plain passwords.
        })),
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json(
        { error: "Internal server error", message: error.message },
        { status: 500 }
      );
    }
  }
  
