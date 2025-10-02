import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";
import Chat from "@/models/Chat"; // We'll need the Chat model to get the ad ID
import { NextRequest, NextResponse } from "next/server";
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(
  req: NextRequest,
  // The { params } object contains the dynamic parts of the URL
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // In this design, the `id` in the URL will be the `chatId`
    const chatId = params.id;
    await connectDB();

    // 1. Find the chat to identify the ad and the seller
    const chat = await Chat.findById(chatId).populate('ad');
    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    // 2. Authorization Check: Is the current user the actual seller for this ad?
    // We get the seller ID from the ad document linked to the chat.
    const ad = chat.ad as any; // Cast to access ad properties
    if (ad.seller.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden: You are not the owner of this ad." }, { status: 403 });
    }

    // 3. Check if the ad is already sold
    if (ad.status === 'sold') {
      return NextResponse.json({ message: "This item has already been sold." }, { status: 400 });
    }

    // 4. Update the Ad: Find the ad by its ID and set its status to "sold"
    const updatedAd = await Ad.findByIdAndUpdate(
      ad._id,
      { status: 'sold' },
      { new: true } // This option returns the updated document
    );

    // Optional: You could add a system message to the chat here later

    return NextResponse.json(updatedAd, { status: 200 });

  } catch (error) {
    console.error("Error marking ad as sold:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}