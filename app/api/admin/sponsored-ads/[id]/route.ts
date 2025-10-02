import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import SponsoredAd from "@/models/SponsoredAd";
import { NextRequest, NextResponse } from "next/server";
/* eslint-disable @typescript-eslint/no-explicit-any */

// --- UTILITY TO GET ID FROM URL (Bypasses context conflict) ---
function getIdFromUrl(req: NextRequest): string | null {
  // The URL structure is /api/admin/sponsored-ads/[id]
  // We can extract the path segments directly from the URL object.
  const pathSegments = req.nextUrl.pathname.split('/');
  // The ID is usually the last segment
  return pathSegments[pathSegments.length - 1] || null;
}
// ------------------------------------------------------------------

// --- PUT: Update an existing sponsored ad ---
// NOTE: Removed the context argument entirely to bypass the fatal type error
export async function PUT(req: NextRequest) { 
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    // Retrieve the ID directly from the request URL pathname
    const id = getIdFromUrl(req);
    if (!id) {
        return NextResponse.json({ message: "Missing resource ID" }, { status: 400 });
    }
    
    const body = await req.json();
    await connectDB();

    // --- VALIDATION LOGIC ---
    if (body.isActive === true) {
      const activeAdsCount = await SponsoredAd.countDocuments({ isActive: true });
      if (activeAdsCount >= 2) {
        return NextResponse.json(
          { message: "You can only have 2 active sponsored ads at a time. Please deactivate another ad first." },
          { status: 400 } 
        );
      }
    }
    // --- END OF VALIDATION LOGIC ---

    const updatedAd = await SponsoredAd.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!updatedAd) {
      return NextResponse.json({ message: "Sponsored ad not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAd, { status: 200 });
  } catch (error: any) {
    console.error("Error updating sponsored ad:", error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}

// --- DELETE: Remove a sponsored ad ---
// NOTE: Removed the context argument entirely
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    // Retrieve the ID directly from the request URL pathname
    const id = getIdFromUrl(req);
    if (!id) {
        return NextResponse.json({ message: "Missing resource ID" }, { status: 400 });
    }

    await connectDB();
    const deletedAd = await SponsoredAd.findByIdAndDelete(id);

    if (!deletedAd) {
      return NextResponse.json({ message: "Sponsored ad not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Sponsored ad deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting sponsored ad:", error);
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}