/* eslint-disable @typescript-eslint/no-explicit-any */


import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// --- UPDATE THE GET FUNCTION ---
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    // 1. Read the new `platform` parameter from the URL
    const platform = searchParams.get('platform');
    const ad_type = searchParams.get('ad_type');
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    const includeSold = searchParams.get('includeSold') === 'true';

    const query: any = {};

    // 2. Add the platform to the query if it exists
    if (platform) {
      query.platform = platform;
    }
    if (ad_type) {
      query.ad_type = ad_type;
    }
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    if (!includeSold) {
      query.status = 'available';
    }

    const sortOptions: any = {};
    if (sortBy && ['members', 'price', 'createdAt'].includes(sortBy)) {
      sortOptions[sortBy] = sortOrder;
    } else {
      sortOptions.createdAt = -1;
    }

    const ads = await Ad.find(query)
      .populate({ 
        path: "seller", 
        model: User, 
        select: "name email image likes dislikes"
      })
      .sort(sortOptions);

    return NextResponse.json(ads, { status: 200 });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching ads." },
      { status: 500 }
    );
  }
}
// --- END OF GET FUNCTION UPDATE ---


// The POST function for creating an ad remains the same
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      platform,
      title,
      description,
      price,
      members,
      openedIn,
      ad_type,
      category,
      link,
    } = body;

    if (!title || !description || !price || !members || !link || !platform) {
      return NextResponse.json(
        { message: "Missing one or more required fields." },
        { status: 400 }
      );
    }

    await connectDB();
    const newAd = new Ad({
      platform,
      title,
      description,
      price,
      members,
      openedIn,
      ad_type,
      category,
      link,
      seller: session.user.id,
    });

    await newAd.save();
    return NextResponse.json(newAd, { status: 201 });

  } catch (error: any) {
    console.error("Error creating ad:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message).join('. ');
      return NextResponse.json(
          { message: messages },
          { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}