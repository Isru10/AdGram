import { getServerSession } from "next-auth/next";


import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();

    // --- LOGIC CHANGE STARTS HERE: DAILY AGGREGATION ---

    // 1. Define the time window: the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 2. Run aggregations for both Users and Ads created in the last 7 days
    const [
      categoryData, // This remains the same
      dailyAdsData,
      dailyUsersData
    ] = await Promise.all([
      Ad.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $project: { name: "$_id", value: "$count", _id: 0 } }
      ]),
      // Aggregate ads by day
      Ad.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } } // Sort by date ascending
      ]),
      // Aggregate users by day
      User.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ])
    ]);

    // 3. Helper function to format the data and fill in missing days
    const formatDailyData = (dbData: {_id: string, count: number}[], dataKey: string) => {
      const dataMap = new Map(dbData.map(item => [item._id, item.count]));
      const result = [];
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
        const dayName = dayNames[date.getDay()];
        
        const entry = {
          name: dayName,
          [dataKey]: dataMap.get(dateString) || 0 // Use count from DB or 0 if no activity
        };
        result.push(entry);
      }
      return result;
    };

    const formattedDailyAds = formatDailyData(dailyAdsData, 'total');
    const formattedDailyUsers = formatDailyData(dailyUsersData, 'users');
    
    // --- LOGIC CHANGE ENDS HERE ---

    return NextResponse.json({
      categoryData,
      dailyAdsData: formattedDailyAds,
      dailyUsersData: formattedDailyUsers,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching admin chart data:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}