import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from 'next/server';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // 1. Authorization Check: Only admins can get an upload signature
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  // 2. Generate the signature
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // This creates a secure signature using your API secret.
    // It proves that the upload request is coming from your application.
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        // You can add other parameters here for more control, e.g., folder
        folder: 'sponsored-ads'
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({ timestamp, signature });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}