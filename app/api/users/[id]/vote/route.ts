
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // 1. Authentication Check: User must be logged in to vote.
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const voterId = session.user.id; // The person who is voting
    const sellerId = params.id;      // The person being voted on
    const { voteType } = await req.json(); // 'like' or 'dislike'

    // 2. Validation Checks
    if (voterId === sellerId) {
      return NextResponse.json({ message: "You cannot vote for yourself." }, { status: 400 });
    }
    if (!['like', 'dislike'].includes(voteType)) {
      return NextResponse.json({ message: "Invalid vote type." }, { status: 400 });
    }

    await connectDB();

    // 3. Find the seller's user document
    const seller = await User.findById(sellerId);
    if (!seller) {
      return NextResponse.json({ message: "Seller not found." }, { status: 404 });
    }

    // 4. Core Voting Logic
    // Check if the user has already liked or disliked this seller
    const hasLiked = seller.likes.includes(voterId);
    const hasDisliked = seller.dislikes.includes(voterId);

    if (voteType === 'like') {
      if (hasLiked) {
        // If they already liked and click like again, remove the like (unlike)
        seller.likes.pull(voterId);
      } else {
        // If they haven't liked, add the like
        seller.likes.push(voterId);
        // If they had previously disliked, remove the dislike
        if (hasDisliked) {
          seller.dislikes.pull(voterId);
        }
      }
    } else if (voteType === 'dislike') {
      if (hasDisliked) {
        // If they already disliked and click dislike again, remove the dislike (undislike)
        seller.dislikes.pull(voterId);
      } else {
        // If they haven't disliked, add the dislike
        seller.dislikes.push(voterId);
        // If they had previously liked, remove the like
        if (hasLiked) {
          seller.likes.pull(voterId);
        }
      }
    }

    // 5. Save the updated seller document
    await seller.save();

    // Return the updated seller with populated likes/dislikes counts for the frontend
    const updatedSeller = await User.findById(sellerId).select('likes dislikes');

    return NextResponse.json(updatedSeller, { status: 200 });

  } catch (error) {
    console.error("Error processing vote:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}