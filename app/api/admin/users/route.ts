
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // 1. Authorization Check: Ensure the user is an admin.
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();

    // 2. Database Query: Find all users in the database.
    // We sort by `createdAt` in descending order to show the newest users first.
    const users = await User.find({})
      .sort({ createdAt: -1 });

    // 3. Return the list of users.
    return NextResponse.json(users, { status: 200 });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}