import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ count: 0 }); // Return 0 if not logged in
  }

  try {
    const userId = session.user.id;
    await connectDB();

    // Sum unread counts where the user is the buyer
    const unreadAsBuyer = await Chat.aggregate([
      { $match: { buyer: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$unreadByBuyer" } } },
    ]);

    // Sum unread counts where the user is the seller
    const unreadAsSeller = await Chat.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$unreadBySeller" } } },
    ]);

    const totalBuyer = unreadAsBuyer[0]?.total || 0;
    const totalSeller = unreadAsSeller[0]?.total || 0;
    
    return NextResponse.json({ count: totalBuyer + totalSeller });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json({ message: "An error occurred." }, { status: 500 });
  }
}
// Note: We need to import mongoose to use mongoose.Types.ObjectId
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
