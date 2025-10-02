// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import { formatDistanceToNow } from 'date-fns';

// type Chat = {
//   _id: string;
//   ad: { title: string } | null; // The ad can now be null
//   buyer: { _id: string, name: string };
//   seller: { _id: string, name: string };
//   unreadByBuyer: number;
//   unreadBySeller: number;
//   updatedAt: string;
// };

// export default function ChatsPage() {
//   const { data: session } = useSession();
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const res = await fetch("/api/chats");
//         if (res.ok) {
//           let data: Chat[] = await res.json();
//           // --- FIX 1: Filter out chats with no associated ad ---
//           // This ensures that we only try to render valid conversations.
//           data = data.filter(chat => chat.ad);
//           setChats(data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch chats:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchChats();
//   }, []);
  
//   if (isLoading) return <p className="text-center p-10 text-slate-400">Loading inbox...</p>;

//   return (
//     <div className="container mx-auto max-w-3xl p-4 md:p-6">
//         <h1 className="text-3xl font-bold mb-6 text-white">Inbox</h1>
//         <div className="space-y-0">
//             {chats.length > 0 ? (
//                 <div className="flex flex-col gap-3">
//                     {chats.map(chat => {
//                         const otherUser = session?.user?.id === chat.seller._id ? chat.buyer : chat.seller;
                        
//                         let hasUnreadMessages = false;
//                         if (session?.user?.id === chat.buyer._id) {
//                             hasUnreadMessages = chat.unreadByBuyer > 0;
//                         } else if (session?.user?.id === chat.seller._id) {
//                             hasUnreadMessages = chat.unreadBySeller > 0;
//                         }

//                         const cardColor = hasUnreadMessages
//                           ? "bg-green-600/20 hover:bg-green-600/30"
//                           : "bg-slate-800 hover:bg-slate-700/50";

//                         const lastMessageDate = formatDistanceToNow(new Date(chat.updatedAt), {
//                           addSuffix: true,
//                         });

//                         return (
//                             <div key={chat._id}>
//                                 <Link href={`/chats/${chat._id}`} className={`block p-4 transition-colors rounded-xl border border-slate-700 ${cardColor}`}>
//                                     <div className="flex justify-between items-start">
//                                       <div>
//                                         <p className="font-semibold text-white">{otherUser.name}</p>
//                                         {/* --- FIX 2: Add a check before rendering the title --- */}
//                                         <p className="text-sm text-slate-400 mt-1">
//                                           {chat.ad ? `Re: ${chat.ad.title}` : "Regarding a deleted ad"}
//                                         </p>
//                                       </div>
//                                       <div className="flex flex-col items-end flex-shrink-0 ml-4">
//                                         <p className="text-xs text-slate-500 mb-1">{lastMessageDate}</p>
//                                         {hasUnreadMessages && (
//                                           <span className="text-xs font-bold text-green-400 bg-green-900/50 px-2 py-1 rounded-full">New</span>
//                                         )}
//                                       </div>
//                                     </div>
//                                 </Link>
//                             </div>
//                         );
//                     })}
//                 </div>
//             ) : (
//                 <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 text-slate-400">
//                     You have no conversations yet.
//                 </div>
//             )}
//         </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';
import { Mail, MessageSquare } from "lucide-react"; // Import a cool icon

type Chat = {
  _id: string;
  ad: { title: string } | null; 
  buyer: { _id: string, name: string };
  seller: { _id: string, name: string };
  unreadByBuyer: number;
  unreadBySeller: number;
  updatedAt: string;
};

export default function ChatsPage() {
  const { data: session } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch("/api/chats");
        if (res.ok) {
          let data: Chat[] = await res.json();
          // Filter out chats with no associated ad
          data = data.filter(chat => chat.ad);
          setChats(data);
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChats();
  }, []);
  
  if (isLoading) {
    // Updated Loading State
    return (
      <p className="text-center p-10 text-sky-400">
        Loading inbox...
      </p>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl p-4 md:p-6">
        {/* Updated Heading style */}
        <h1 className="text-3xl font-extrabold mb-8 text-white tracking-wide flex items-center gap-3">
          <Mail className="h-7 w-7 text-sky-400" /> Inbox
        </h1>
        
        <div className="space-y-0">
            {chats.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {chats.map(chat => {
                        const otherUser = session?.user?.id === chat.seller._id ? chat.buyer : chat.seller;
                        
                        let unreadCount = 0;
                        if (session?.user?.id === chat.buyer._id) {
                            unreadCount = chat.unreadByBuyer;
                        } else if (session?.user?.id === chat.seller._id) {
                            unreadCount = chat.unreadBySeller;
                        }
                        const hasUnreadMessages = unreadCount > 0;

                        // --- NEW STYLES: Use deep blue for default, accent blue for unread ---
                        const cardColor = hasUnreadMessages
                          ? "bg-sky-800 hover:bg-sky-700/80 border-sky-600" // Prominent for unread
                          : "bg-sky-900 hover:bg-sky-800/80 border-sky-800"; // Sleek for read

                        const lastMessageDate = formatDistanceToNow(new Date(chat.updatedAt), {
                          addSuffix: true,
                        });

                        return (
                            <Link 
                                key={chat._id} 
                                href={`/chats/${chat._id}`} 
                                className={`block p-5 transition-all duration-300 rounded-xl border ${cardColor}`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center justify-center h-10 w-10 rounded-full bg-sky-600 text-white font-bold text-lg flex-shrink-0">
                                            {otherUser.name.charAt(0)}
                                        </div>
                                        <div>
                                            {/* Highlight the name if unread */}
                                            <p className={`font-semibold ${hasUnreadMessages ? 'text-sky-400' : 'text-white'}`}>
                                                {otherUser.name}
                                            </p>
                                            {/* Ad title is subtle */}
                                            <p className="text-sm text-slate-400 mt-1">
                                            <MessageSquare className="inline h-3.5 w-3.5 mr-1 mb-0.5" />
                                              {chat.ad ? chat.ad.title : "Regarding a deleted ad"}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end flex-shrink-0 ml-4">
                                        <p className="text-xs text-slate-500 mb-1">{lastMessageDate}</p>
                                        {hasUnreadMessages && (
                                            // --- NEW UNREAD BADGE: Accent blue background and white text ---
                                            <span className="text-xs font-extrabold text-white bg-sky-600 px-2.5 py-0.5 rounded-full shadow-lg shadow-sky-500/40">
                                                {unreadCount} New
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                // Updated Empty State
                <div className="bg-sky-900 rounded-xl border border-sky-700 p-8 text-slate-400 text-center shadow-xl shadow-sky-950/20">
                    <p className="text-white font-semibold mb-2">You have no active conversations yet.</p>
                    <p>Start a conversation by viewing a listing on the <Link href="/ads" className="text-sky-400 hover:underline">marketplace</Link>.</p>
                </div>
            )}
        </div>
    </div>
  );
}