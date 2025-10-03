// import { type NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Ad from "@/models/Ad";
// import User from "@/models/User";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import Chat from "@/models/Chat";
// import Message from "@/models/Message";

// // The context object contains the dynamic route parameters (params)
// type RouteContext = {
//   params: {
//     id: string;
//   };
// };

// export async function GET(req: NextRequest, context: RouteContext) {
//   try {
//     await connectDB();
    
//     // --- THIS IS THE FIX ---
//     // Access the id from the context object's params property.
//     const { id } = context.params;

//     const ad = await Ad.findById(id).populate({
//       path: "seller",
//       model: User,
//       select: "name email image",
//     });

//     if (!ad) {
//       return NextResponse.json({ message: "Ad not found" }, { status: 404 });
//     }

//     return NextResponse.json(ad, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching single ad:", error);
//     if (error instanceof Error && error.name === 'CastError') {
//       return NextResponse.json({ message: "Invalid Ad ID format" }, { status: 400 });
//     }
//     return NextResponse.json(
//       { message: "An error occurred while fetching the ad." },
//       { status: 500 }
//     );
//   }
// }



// export async function DELETE(req: NextRequest, context: RouteContext) {
//   const session = await getServerSession(authOptions);

//   // 1. Authentication Check: Is the user logged in?
//   if (!session?.user?.id) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const { id: adId } = context.params;
//     await connectDB();

//     // 2. Find the ad that the user wants to delete
//     const ad = await Ad.findById(adId);
//     if (!ad) {
//       return NextResponse.json({ message: "Ad not found" }, { status: 404 });
//     }

//     // 3. Authorization Check: Does this ad belong to the logged-in user?
//     // This is the most important security step.
//     if (ad.seller.toString() !== session.user.id) {
//       return NextResponse.json({ message: "Forbidden: You are not the owner of this ad." }, { status: 403 });
//     }

//     // 4. Clean up associated data before deleting the ad itself
//     // Find all chats related to this ad
//     const relatedChats = await Chat.find({ ad: adId });
//     if (relatedChats.length > 0) {
//       const chatIds = relatedChats.map(chat => chat._id);
      
//       // Delete all messages within those chats
//       await Message.deleteMany({ chat: { $in: chatIds } });
      
//       // Delete the chats themselves
//       await Chat.deleteMany({ ad: adId });
//     }
    
//     // 5. Delete the ad itself
//     await Ad.findByIdAndDelete(adId);

//     return NextResponse.json({ message: "Ad and all associated chats have been deleted successfully." }, { status: 200 });

//   } catch (error) {
//     console.error("Error deleting ad:", error);
//     return NextResponse.json(
//       { message: "An internal server error occurred." },
//       { status: 500 }
//     );
//   }
// }




import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Chat from "@/models/Chat";
import Message from "@/models/Message";

// NOTE: params is a Promise<{ id: string }> in Next.js 15+
// Use this shape in EVERY handler and await it inside the function.

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // await the params Promise to get the id
    const { id } = await params;

    const ad = await Ad.findById(id).populate({
      path: "seller",
      model: User,
      select: "name email image",
    });

    if (!ad) {
      return NextResponse.json({ message: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json(ad, { status: 200 });
  } catch (error) {
    console.error("Error fetching single ad:", error);
    // handle cast error (invalid ObjectId)
    if (error instanceof Error && error.name === "CastError") {
      return NextResponse.json({ message: "Invalid Ad ID format" }, { status: 400 });
    }
    return NextResponse.json(
      { message: "An error occurred while fetching the ad." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // await params here too
    const { id: adId } = await params;
    await connectDB();

    const ad = await Ad.findById(adId);
    if (!ad) {
      return NextResponse.json({ message: "Ad not found" }, { status: 404 });
    }

    if (ad.seller.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden: You are not the owner of this ad." }, { status: 403 });
    }

    // remove associated chats and messages
    const relatedChats = await Chat.find({ ad: adId });
    if (relatedChats.length > 0) {
      const chatIds = relatedChats.map(chat => chat._id);
      await Message.deleteMany({ chat: { $in: chatIds } });
      await Chat.deleteMany({ ad: adId });
    }

    await Ad.findByIdAndDelete(adId);

    return NextResponse.json({ message: "Ad and all associated chats have been deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
