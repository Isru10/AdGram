import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import Message from "@/models/Message"
import User from "@/models/User"
import { pusherServer } from "@/lib/pusher"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, receiverId, telegramId } = await request.json()

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create chat ID from user IDs (consistent ordering)
    const chatId = [user._id.toString(), receiverId].sort().join("-")

    const message = await Message.create({
      chatId,
      senderId: user._id, // Use MongoDB ObjectId instead of OAuth string
      receiverId,
      telegramId,
      content,
      messageType: "text",
    })

    // Populate sender info for real-time update
    await message.populate("senderId", "name email")

    // Send real-time update via Pusher
    await pusherServer.trigger(`chat-${chatId}`, "new-message", {
      id: message._id,
      content: message.content,
      senderId: message.sender,
      createdAt: message.createdAt,
    })

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error("Message send error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const otherUserId = searchParams.get("otherUserId")

    if (!otherUserId) {
      return NextResponse.json({ error: "Other user ID required" }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const chatId = [user._id.toString(), otherUserId].sort().join("-")

    const messages = await Message.find({ chatId }).populate("senderId", "name email").sort({ createdAt: 1 }).limit(50)

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Messages fetch error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
