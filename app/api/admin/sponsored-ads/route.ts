import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import SponsoredAd from "@/models/SponsoredAd";
import { NextRequest, NextResponse } from "next/server";
/* eslint-disable @typescript-eslint/no-explicit-any */

// --- GET: Fetch all sponsored ads ---
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();
    const sponsoredAds = await SponsoredAd.find({}).sort({ createdAt: -1 });
    return NextResponse.json(sponsoredAds, { status: 200 });
  } catch (error) {
    console.error("Error fetching sponsored ads:", error);
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}

// --- POST: Create a new sponsored ad ---
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { companyName, description, imageUrl, destinationUrl, isActive } = body;

    // Basic validation
    if (!companyName || !description || !imageUrl || !destinationUrl) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const newSponsoredAd = new SponsoredAd({
      companyName,
      description,
      imageUrl,
      destinationUrl,
      isActive,
    });

    await newSponsoredAd.save();
    return NextResponse.json(newSponsoredAd, { status: 201 });

  } catch (error: any) {
    console.error("Error creating sponsored ad:", error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}