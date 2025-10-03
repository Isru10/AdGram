// import { getServerSession } from "next-auth/next";
// import { type NextRequest, NextResponse } from "next/server";
// import { authOptions } from "@/lib/auth";
// import { connectDB } from "@/lib/db";
// import { pusherServer } from "@/lib/pusher";
// import Chat from "@/models/Chat";
// import Message from "@/models/Message";
// import User from "@/models/User";

// interface Params {
//   params: { chatId: string };
// }

// // GET: Fetch all messages for a specific chat
// export async function GET(req: NextRequest, { params }: Params) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const { chatId } = params;
//     await connectDB();

//     // Authorization: Check if the user is part of this chat
//     const chat = await Chat.findById(chatId);
//     if (!chat || (chat.buyer.toString() !== session.user.id && chat.seller.toString() !== session.user.id)) {
//         return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     }

//     const messages = await Message.find({ chat: chatId })
//       .populate({ path: "sender", model: User, select: "name email image" })
//       .sort({ createdAt: "asc" }); // Oldest messages first

//     return NextResponse.json(messages, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     return NextResponse.json({ message: "An error occurred." }, { status: 500 });
//   }
// }

// // POST: Send a new message in a specific chat




// export async function POST(req: NextRequest, { params }: { params: { chatId: string } }) {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }
    
//     try {
//         const { chatId } = params;
//         const { content } = await req.json();

//         if (!content) {
//             return NextResponse.json({ message: "Content cannot be empty." }, { status: 400 });
//         }
        
//         await connectDB();

//         const chat = await Chat.findById(chatId);
//         if (!chat || (chat.buyer.toString() !== session.user.id && chat.seller.toString() !== session.user.id)) {
//             return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//         }

//         const newMessage = await Message.create({
//             chat: chatId,
//             sender: session.user.id,
//             content: content,
//         });

//         // --- START OF NEW LOGIC ---
//         // Determine who the receiver is and increment their unread count.
//         const update = {
//             updatedAt: new Date(), // Bring chat to top of inbox
//             $inc: {}, // The increment operation
//         };

//         if (session.user.id === chat.buyer.toString()) {
//             // If the buyer sends a message, increment the seller's unread count
//             update.$inc = { unreadBySeller: 1 };
//         } else {
//             // If the seller sends a message, increment the buyer's unread count
//             update.$inc = { unreadByBuyer: 1 };
//         }

//         await Chat.findByIdAndUpdate(chatId, update);
//         // --- END OF NEW LOGIC ---

//         const populatedMessage = await newMessage.populate({ path: "sender", model: User, select: "name email image" });
        
//         await pusherServer.trigger(`private-chat-${chatId}`, "new-message", populatedMessage);

//         return NextResponse.json(populatedMessage, { status: 201 });
//     } catch (error) {
//         console.error("Error sending message:", error);
//         return NextResponse.json({ message: "An error occurred." }, { status: 500 });
//     }
// }



import { getServerSession } from "next-auth/next";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import User from "@/models/User";

/* eslint-disable @typescript-eslint/no-explicit-any */

// GET: Fetch all messages for a specific chat
export async function GET(
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

    // Authorization: Check if the user is part of this chat
    const chat = await Chat.findById(chatId);
    if (
      !chat ||
      (chat.buyer.toString() !== session.user.id &&
        chat.seller.toString() !== session.user.id)
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const messages = await Message.find({ chat: chatId })
      .populate({ path: "sender", model: User, select: "name email image" })
      .sort({ createdAt: "asc" }); // Oldest messages first

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ message: "An error occurred." }, { status: 500 });
  }
}

// POST: Send a new message in a specific chat
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
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { message: "Content cannot be empty." },
        { status: 400 }
      );
    }

    await connectDB();

    const chat = await Chat.findById(chatId);
    if (
      !chat ||
      (chat.buyer.toString() !== session.user.id &&
        chat.seller.toString() !== session.user.id)
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const newMessage = await Message.create({
      chat: chatId,
      sender: session.user.id,
      content: content,
    });

    // --- START OF NEW LOGIC ---
    // Determine who the receiver is and increment their unread count.
    const update: any = {
      updatedAt: new Date(), // Bring chat to top of inbox
      $inc: {},
    };

    if (session.user.id === chat.buyer.toString()) {
      // If the buyer sends a message, increment the seller's unread count
      update.$inc = { unreadBySeller: 1 };
    } else {
      // If the seller sends a message, increment the buyer's unread count
      update.$inc = { unreadByBuyer: 1 };
    }

    await Chat.findByIdAndUpdate(chatId, update);
    // --- END OF NEW LOGIC ---

    const populatedMessage = await newMessage.populate({
      path: "sender",
      model: User,
      select: "name email image",
    });

    await pusherServer.trigger(
      `private-chat-${chatId}`,
      "new-message",
      populatedMessage
    );

    return NextResponse.json(populatedMessage, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ message: "An error occurred." }, { status: 500 });
  }
}
