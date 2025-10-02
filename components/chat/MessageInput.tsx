"use client";

import { useState, FormEvent } from "react";

type MessageInputProps = {
  chatId: string;
  onMessageSent: () => void; // A function to trigger refetching messages on the page
};

const MessageInput = ({ chatId, onMessageSent }: MessageInputProps) => {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setContent(""); // Clear input on successful send
        onMessageSent(); // Notify parent component
      } else {
        // Handle error (e.g., show a toast notification)
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white border-t flex items-center gap-4"
    >
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        autoComplete="off"
        disabled={isSending}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 disabled:bg-blue-400"
        disabled={!content.trim() || isSending}
      >
        {isSending ? "Sending..." : "Send"}
      </button>
    </form>
  );
};

export default MessageInput;