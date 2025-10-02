import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";
import Ad from "@/models/Ad"; // We need the Ad model for population
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { chatId } =  params;
    await connectDB();

    // Find the chat and populate the associated 'ad' document
    const chat = await Chat.findById(chatId).populate('ad');

    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    // Authorization: Ensure the user is part of this chat
    if (
      chat.buyer.toString() !== session.user.id &&
      chat.seller.toString() !== session.user.id
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    // Return the full chat object, which now includes the ad details
    return NextResponse.json(chat, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat details:", error);
    return NextResponse.json({ message: "An error occurred." }, { status: 500 });
  }
}