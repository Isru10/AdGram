import { getServerSession } from "next-auth/next";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";
import Chat from "@/models/Chat";
import User from "@/models/User";

// POST: Start a new chat or retrieve an existing one
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { adId } = await req.json();
    if (!adId) {
      return NextResponse.json(
        { message: "Ad ID is required." },
        { status: 400 }
      );
    }

    await connectDB();
    const ad = await Ad.findById(adId);
    if (!ad) {
      return NextResponse.json({ message: "Ad not found." }, { status: 404 });
    }

    const buyerId = session.user.id;
    const sellerId = ad.seller.toString();

    if (buyerId === sellerId) {
      return NextResponse.json(
        { message: "You cannot start a chat with yourself." },
        { status: 400 }
      );
    }

    // Check if a chat already exists
    let chat = await Chat.findOne({
      ad: adId,
      buyer: buyerId,
    });

    if (!chat) {
      // If no chat exists, create a new one
      chat = await Chat.create({
        ad: adId,
        buyer: buyerId,
        seller: sellerId,
      });
    }

    return NextResponse.json(chat, { status: 200 }); // Return 200 OK for both find and create
  } catch (error) {
    console.error("Error starting chat:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}

// GET: List all chats for the logged-in user
// We only need to update the GET function
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const userId = session.user.id;

    const chats = await Chat.find({
      $or: [{ buyer: userId }, { seller: userId }],
    })
      // The .lean() method makes the query faster and returns plain JavaScript objects
      // which are easier to work with. No changes needed to populate.
      .populate({ path: "ad", select: "title" })
      .populate({ path: "buyer", select: "name image" })
      .populate({ path: "seller", select: "name image" })
      .sort({ updatedAt: -1 })
      .lean(); // Using .lean() for performance

    // The fields `unreadByBuyer` and `unreadBySeller` will now be included automatically
    // because they are part of the main Chat model.

    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}