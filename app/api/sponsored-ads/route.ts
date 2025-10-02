
import { connectDB } from "@/lib/db";
import SponsoredAd from "@/models/SponsoredAd";
import { NextRequest, NextResponse } from "next/server";

// A public GET endpoint to fetch active sponsored ads.
// Notice there is NO session check here.
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Find all sponsored ads where `isActive` is true.
    const sponsoredAds = await SponsoredAd.find({ isActive: true })
      .sort({ createdAt: -1 }) // Show newest active ads first
      .limit(2); // Limit to the top 2 as we planned

    return NextResponse.json(sponsoredAds, { status: 200 });
  } catch (error) {
    console.error("Error fetching sponsored ads:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}