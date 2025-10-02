import { getServerSession } from "next-auth/next";


import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Ad from "@/models/Ad";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();

    // Define the date for 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // --- NEW, MORE ADVANCED QUERIES ---
    const [
      userStats,
      adStats,
      soldAds
    ] = await Promise.all([
      // Aggregate user data
      User.aggregate([
        {
          $facet: {
            totalUsers: [{ $count: "count" }],
            usersChange: [
              { $match: { createdAt: { $gte: sevenDaysAgo } } },
              { $count: "count" }
            ]
          }
        }
      ]),
      // Aggregate ad data
      Ad.aggregate([
        {
          $facet: {
            totalAds: [{ $count: "count" }],
            adsChange: [
              { $match: { createdAt: { $gte: sevenDaysAgo } } },
              { $count: "count" }
            ]
          }
        }
      ]),
      // Count sold ads (this query is simpler and remains the same)
      Ad.countDocuments({ status: 'sold' }),
    ]);

    // --- EXTRACT AND ASSEMBLE THE DATA ---
    const totalUsers = userStats[0]?.totalUsers[0]?.count || 0;
    const usersChange = userStats[0]?.usersChange[0]?.count || 0;
    
    const totalAds = adStats[0]?.totalAds[0]?.count || 0;
    const adsChange = adStats[0]?.adsChange[0]?.count || 0;
    
    const availableAds = totalAds - soldAds;

    const stats = {
      totalUsers,
      usersChange,
      totalAds,
      adsChange,
      availableAds,
      soldAds,
      totalRevenue: soldAds * 5,
    };

    return NextResponse.json(stats, { status: 200 });

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}