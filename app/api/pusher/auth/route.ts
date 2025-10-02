import { getServerSession } from "next-auth/next";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const data = await req.formData();
  const socketId = data.get("socket_id") as string;
  const channel = data.get("channel_name") as string;

  // Channel name is expected to be "private-chat-<chatId>"
  const chatId = channel.substring("private-chat-".length);
  const userId = session.user.id;

  try {
    await connectDB();
    const chat = await Chat.findById(chatId);

    // Authorization check
    if (!chat || (chat.buyer.toString() !== userId && chat.seller.toString() !== userId)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const userData = {
      user_id: userId,
    };
    
    const authResponse = pusherServer.authorizeChannel(socketId, channel, userData);
    return NextResponse.json(authResponse);

  } catch (error) {
      console.error("Pusher auth error:", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


