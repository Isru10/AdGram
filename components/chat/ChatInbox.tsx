"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the types for the props
type ChatParticipant = {
  _id: string;
  name: string;
  image?: string;
};

type ChatPreview = {
  _id: string;
  buyer: ChatParticipant;
};

type ChatInboxProps = {
  chats: ChatPreview[];
  adId: string;
};

const ChatInbox = ({ chats, adId }: ChatInboxProps) => {
  const pathname = usePathname();

  console.log("this is the total chats inbox" , chats);

  if (chats.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-500">
        <p>No one has started a conversation yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 border rounded-lg bg-white">
      <h3 className="text-lg font-bold p-4 border-b">Conversations</h3>
      <ul className="divide-y">
        {chats.map((chat) => {
          // Check if the current chat is the one being viewed
          const isActive = pathname.includes(chat._id);

          return (
            <li key={chat._id}>
              <Link
                href={`/chats/${chat._id}`}
                className={`block p-4 hover:bg-gray-50 ${
                  isActive ? "bg-blue-50" : ""
                }`}
              >
                <p className="font-semibold text-gray-800">
                  {chat.buyer.name}
                </p>
                <p className="text-sm text-gray-500">
                  Interested in your ad...
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatInbox;