import Image from "next/image";

// Define types for the message and sender
type Sender = {
  _id: string;
  name: string;
  image?: string;
};

export type Message = {
  _id: string;
  content: string;
  sender: Sender;
  createdAt: string;
};

type ChatMessageProps = {
  message: Message;
  currentUserId: string;
};

const ChatMessage = ({ message, currentUserId }: ChatMessageProps) => {
  const isCurrentUser = message.sender._id === currentUserId;

  return (
    <div
      className={`flex items-end gap-2 my-2 ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar for the other user */}
      {!isCurrentUser && (
        // <Image
        //   src={message.sender.image || "/default-avatar.png"} // Provide a path to a default avatar
        //   alt={message.sender.name}
        //   width={32}
        //   height={32}
        //   className="rounded-full"
        // />
        <div className="text-white bg-blue-800  rounded-full w-8 h-8 flex items-center justify-center "> {message.sender.name.charAt(0)} </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-xs md:max-w-md p-3 rounded-lg ${
          isCurrentUser
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;