
// "use client";
// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { useParams } from "next/navigation";
// import { useEffect, useState, useRef, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { pusherClient } from "@/lib/pusher";
// import ChatMessage, { type Message } from "@/components/chat/ChatMessage";
// import MessageInput from "@/components/chat/MessageInput";
// import type { IAd } from "@/models/Ad";

// type ChatDetails = {
//   _id: string;
//   buyer: string;
//   seller: string;
//   ad: IAd;
// };

// export default function ChatPage() {
//   const params = useParams();
//   const chatId = params.chatId as string;
//   const { data: session } = useSession();
  
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSelling, setIsSelling] = useState(false);
  
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // --- FIX 1: SIMPLIFY fetchMessages ---
//   // This function should ONLY be responsible for fetching messages.
//   // We remove the setIsLoading logic from it entirely.
//   const fetchMessages = useCallback(async () => {
//     if (!chatId) return;
//     try {
//       const res = await fetch(`/api/chats/${chatId}/messages`);
//       if (res.ok) {
//         const data = await res.json();
//         setMessages(data);
//       }
//     } catch (error) {
//         console.error("Failed to fetch messages:", error);
//     }
//   }, [chatId]);

//   // --- FIX 2: CENTRALIZE DATA FETCHING AND LOADING STATE ---
//   useEffect(() => {
//     if (!chatId) return;

//     const markAsRead = async () => {
//       // This can run in the background, we don't need to wait for it.
//       fetch(`/api/chats/${chatId}/read`, { method: "POST" });
//     };

//     const fetchAllChatData = async () => {
//         setIsLoading(true); // Set loading to true at the very beginning.
//         try {
//             // Fetch both sets of data. Promise.all is efficient for this.
//             const [detailsRes, messagesRes] = await Promise.all([
//                 fetch(`/api/chats/${chatId}/details`),
//                 fetch(`/api/chats/${chatId}/messages`)
//             ]);

//             if (detailsRes.ok) {
//                 const detailsData = await detailsRes.json();
//                 setChatDetails(detailsData);
//             }
//             if (messagesRes.ok) {
//                 const messagesData = await messagesRes.json();
//                 setMessages(messagesData);
//             }
//         } catch (error) {
//             console.error("Failed to load chat page data", error);
//         } finally {
//             // Set loading to false only after EVERYTHING is finished.
//             setIsLoading(false);
//         }
//     }

//     fetchAllChatData();
//     markAsRead();
//   }, [chatId]); // This effect now correctly depends only on chatId.

//   // Pusher and scroll effects remain unchanged
//   useEffect(() => {
//     if (!chatId) return;
//     const channelName = `private-chat-${chatId}`;
//     pusherClient.subscribe(channelName);
//     const handleNewMessage = (newMessage: Message) => {
//       setMessages((prev) => [...prev, newMessage]);
//     };
//     pusherClient.bind("new-message", handleNewMessage);
//     return () => {
//       pusherClient.unsubscribe(channelName);
//       pusherClient.unbind("new-message", handleNewMessage);
//     };
//   }, [chatId]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // The handleSell function remains unchanged
//   const handleSell = async () => {
//     if (!chatId) return;
//     setIsSelling(true);
//     try {
//       const res = await fetch(`/api/ads/${chatId}/sell`, { method: "POST" });
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to complete sale.");
//       }
//       alert("Sale successful! The ad has been marked as sold.");
//       const detailsRes = await fetch(`/api/chats/${chatId}/details`);
//       const detailsData = await detailsRes.json();
//       setChatDetails(detailsData);
//     } catch (error: any) {
//       console.error(error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setIsSelling(false);
//     }
//   };
  
//   if (isLoading) return <p className="text-center p-4 text-slate-400">Loading chat...</p>;
//   if (!session || !chatDetails) return null;

//   const isSeller = session.user.id === chatDetails.seller;
//   const isAdAvailable = chatDetails.ad.status === 'available';

//   // The JSX remains unchanged
//   return (
//     <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto">
//         <div className="bg-slate-800 p-4 rounded-t-lg border-b border-slate-700 flex justify-between items-center">
//             <h2 className="text-lg font-bold text-white">
//             Conversation for: <span className="text-blue-400">{chatDetails.ad.title}</span>
//             </h2>
//             {isSeller && isAdAvailable && (
//             <button
//                 onClick={handleSell}
//                 disabled={isSelling}
//                 className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
//             >
//                 {isSelling ? 'Processing...' : 'Sell to this Buyer'}
//             </button>
//             )}
//             {isSeller && !isAdAvailable && (
//             <span className="px-4 py-2 bg-red-800 text-white font-semibold rounded-md text-sm">SOLD</span>
//             )}
//         </div>
//         <div className="flex-1 overflow-y-auto p-4 bg-slate-800">
//             {messages.length > 0 ? (
//             messages.map((msg) => (
//                 <ChatMessage key={msg._id} message={msg} currentUserId={session.user.id} />
//             ))
//             ) : (
//             <p className="text-center text-slate-500">No messages yet. Say hello!</p>
//             )}
//             <div ref={scrollRef} />
//         </div>
//         <MessageInput chatId={chatId} onMessageSent={fetchMessages} />
//     </div>
//   );
// }



"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import ChatMessage, { type Message } from "@/components/chat/ChatMessage";
import MessageInput from "@/components/chat/MessageInput";
import type { IAd } from "@/models/Ad";
import { DollarSign, CheckCircle } from "lucide-react"; // Import cool icons
import { toast } from "sonner";

type ChatDetails = {
  _id: string;
  buyer: string;
  seller: string;
  ad: IAd;
};

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const { data: session } = useSession();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelling, setIsSelling] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Function to fetch messages (for initial load and after sending)
  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
        console.error("Failed to fetch messages:", error);
    }
  }, [chatId]);

  // Centralized Data Fetching and Loading State
  useEffect(() => {
    if (!chatId) return;

    const markAsRead = async () => {
      // Runs in the background
      fetch(`/api/chats/${chatId}/read`, { method: "POST" });
    };

    const fetchAllChatData = async () => {
        setIsLoading(true);
        try {
            const [detailsRes, messagesRes] = await Promise.all([
                fetch(`/api/chats/${chatId}/details`),
                fetch(`/api/chats/${chatId}/messages`)
            ]);

            if (detailsRes.ok) {
                const detailsData = await detailsRes.json();
                setChatDetails(detailsData);
            }
            if (messagesRes.ok) {
                const messagesData = await messagesRes.json();
                setMessages(messagesData);
            }
        } catch (error) {
            console.error("Failed to load chat page data", error);
        } finally {
            setIsLoading(false);
        }
    }

    fetchAllChatData();
    markAsRead();
  }, [chatId]);

  // Pusher and scroll effects remain the same
  useEffect(() => {
    if (!chatId) return;
    const channelName = `private-chat-${chatId}`;
    pusherClient.subscribe(channelName);
    const handleNewMessage = (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    };
    pusherClient.bind("new-message", handleNewMessage);
    return () => {
      pusherClient.unsubscribe(channelName);
      pusherClient.unbind("new-message", handleNewMessage);
    };
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // The handleSell function remains the same
  const handleSell = async () => {
    if (!chatId) return;
    setIsSelling(true);
    try {
      const res = await fetch(`/api/ads/${chatId}/sell`, { method: "POST" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to complete sale.");
      }
      toast.success("Sale successful! The ad has been marked as sold.");
      const detailsRes = await fetch(`/api/chats/${chatId}/details`);
      const detailsData = await detailsRes.json();
      setChatDetails(detailsData);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSelling(false);
    }
  };
  
  if (isLoading) return <p className="text-center p-4 text-sky-400">Loading chat...</p>;
  if (!session || !chatDetails) return null;

  const isSeller = session.user.id === chatDetails.seller;
  const isAdAvailable = chatDetails.ad.status === 'available';

  return (
    // Updated container and color scheme
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-sky-950/20">
        
        {/* Chat Header (Prominent Blue) */}
        <div className="bg-sky-900 p-4 border-b border-sky-800 flex justify-between items-center flex-wrap gap-3">
            <h2 className="text-lg font-bold text-white tracking-wide">
                <span className="text-slate-400 font-normal mr-2">Conversation for:</span> 
                <span className="text-sky-400">{chatDetails.ad.title}</span>
            </h2>
            
            {/* Action Buttons / Status */}
            <div className="flex-shrink-0">
                {isSeller && isAdAvailable && (
                <button
                    onClick={handleSell}
                    disabled={isSelling}
                    // Sleek, high-contrast Sell button
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 disabled:bg-sky-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-700/30"
                >
                    <DollarSign className="h-4 w-4" />
                    {isSelling ? 'Processing...' : 'Complete Sale'}
                </button>
                )}
                {isSeller && !isAdAvailable && (
                <span className="px-4 py-2 bg-sky-700 text-white font-bold rounded-full text-sm flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    SOLD
                </span>
                )}
                {!isSeller && !isAdAvailable && (
                    <span className="px-4 py-2 bg-red-700 text-white font-bold rounded-full text-sm">
                        AD SOLD
                    </span>
                )}
            </div>
        </div>
        
        {/* Message Area (Dark Blue background) */}
        <div className="flex-1 overflow-y-auto p-4 bg-sky-950">
            {messages.length > 0 ? (
            messages.map((msg) => (
                // Assuming ChatMessage handles the individual message styling for the dark theme
                <ChatMessage key={msg._id} message={msg} currentUserId={session.user.id} />
            ))
            ) : (
            <p className="text-center text-slate-500 pt-10">No messages yet. Say hello!</p>
            )}
            <div ref={scrollRef} />
        </div>
        
        {/* Message Input (Slightly lighter blue background) */}
        <div className="bg-sky-900 border-t border-sky-800 p-4">
            {/* Assuming MessageInput component also handles its internal dark-theme styling */}
            <MessageInput chatId={chatId} onMessageSent={fetchMessages} />
        </div>
    </div>
  );
}