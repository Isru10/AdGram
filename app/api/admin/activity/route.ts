import { getServerSession } from "next-auth/next";


import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; // We need this for populating

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();

    // Get the 5 most recently sold ads, now with seller info
    const recentSales = await Ad.find({ status: 'sold' })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate({ path: 'seller', model: User, select: 'name image' }) // Populate seller details
      .select('title price seller'); // Also select the seller field

    // Get the top 5 ads by member count, now with category
    const topAds = await Ad.find({ status: 'available' })
      .sort({ members: -1 })
      .limit(5)
      .select('title members category'); // Also select the category field

    return NextResponse.json({
      recentSales,
      topAds,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching admin activity data:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}