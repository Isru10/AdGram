// import { getServerSession } from "next-auth/next";

// import { authOptions } from "@/lib/auth";
// import { connectDB } from "@/lib/db";
// import Chat from "@/models/Chat";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { chatId: string } }
// ) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const { chatId } = params;
//     await connectDB();
//     const chat = await Chat.findById(chatId);

//     if (!chat) {
//       return NextResponse.json({ message: "Chat not found" }, { status: 404 });
//     }

//     // Determine if the current user is the buyer or seller and update accordingly
//     if (session.user.id === chat.buyer.toString()) {
//       chat.unreadByBuyer = 0;
//     } else if (session.user.id === chat.seller.toString()) {
//       chat.unreadBySeller = 0;
//     } else {
//         return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     }

//     await chat.save();
//     return NextResponse.json({ message: "Success" }, { status: 200 });
//   } catch (error) {
//     console.error("Error marking chat as read:", error);
//     return NextResponse.json({ message: "An error occurred." }, { status: 500 });
//   }
// }




import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> } // 👈 Promise type
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { chatId } = await params; // 👈 Await it
    await connectDB();

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    // Determine if the current user is the buyer or seller and update accordingly
    if (session.user.id === chat.buyer.toString()) {
      chat.unreadByBuyer = 0;
    } else if (session.user.id === chat.seller.toString()) {
      chat.unreadBySeller = 0;
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await chat.save();
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error marking chat as read:", error);
    return NextResponse.json({ message: "An error occurred." }, { status: 500 });
  }
}
