import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    await connectDB();

    // --- FIX IS HERE ---
    // Update the .populate() call to be identical to the main ads API,
    // including the `likes` and `dislikes` fields.
    const myAds = await Ad.find({ seller: userId })
      .populate({ 
        path: "seller", 
        model: User, 
        select: "name image likes dislikes" // Add likes and dislikes here
      })
      .sort({ createdAt: -1 });
    // --- END OF FIX ---

    return NextResponse.json(myAds, { status: 200 });

  } catch (error) {
    console.error("Error fetching user's ads:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}