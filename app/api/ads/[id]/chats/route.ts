// import { getServerSession } from "next-auth/next";

// import { authOptions } from "@/lib/auth";
// import { connectDB } from "@/lib/db";
// import Ad from "@/models/Ad";
// import Chat from "@/models/Chat";
// import User from "@/models/User";
// import { NextRequest, NextResponse } from "next/server";

// // GET: Fetch all chats for a specific ad
// export async function GET(
//   req: NextRequest,
//   // --- THIS IS THE CORRECTED FUNCTION SIGNATURE ---
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     // --- AND THIS IS THE CORRECTED ACCESS METHOD ---
//     const adId = params.id;
//     console.log("Fetching chatooss foooorr ad:", adId);
//     await connectDB();

//     // First, find the ad to verify the owner
//     const ad = await Ad.findById(adId);
//     if (!ad) {
//       return NextResponse.json({ message: "Ad not found" }, { status: 404 });
//     }

//     // Authorization: Ensure the person making the request is the ad's seller
//     if (ad.seller.toString() !== session.user.id) {
//       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     }

//     // If authorized, find all chats associated with this ad
//     const chats = await Chat.find({ ad: adId }).populate({
//       path: "buyer",
//       model: User,
//       select: "name email image",
//     });

//     return NextResponse.json(chats, { status: 200 });

//   } catch (error) {
//     console.error(`Error fetching chats for ad:`, error);
//     return NextResponse.json(
//       { message: "An error occurred while fetching chats." },
//       { status: 500 }
//     );
//   }
// }




import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";
import Chat from "@/models/Chat";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// Note: params is a Promise<{ id: string }> in Next.js 15+
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // await the params Promise to extract the id
    const awaitedParams = await params;
    const adId = awaitedParams.id;

    console.log("Fetching chats for ad:", adId);

    await connectDB();

    const ad = await Ad.findById(adId);
    if (!ad) {
      return NextResponse.json({ message: "Ad not found" }, { status: 404 });
    }

    if (ad.seller.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const chats = await Chat.find({ ad: adId }).populate({
      path: "buyer",
      model: User,
      select: "name email image",
    });

    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    // fixed console.error syntax
    console.error("Error fetching chats for ad:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching chats." },
      { status: 500 }
    );
  }
}
