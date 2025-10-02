"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { pusherClient } from "@/lib/pusher"
import { Send } from "lucide-react"

interface Message {
  id: string
  content: string
  senderId: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
}

interface ChatComponentProps {
  otherUserId: string
  otherUserName: string
  telegramId: string
}

export default function ChatComponent({ otherUserId, otherUserName, telegramId }: ChatComponentProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chatId = session?.user?.id && otherUserId ? [session.user.id, otherUserId].sort().join("-") : null

  // Fetch existing messages
  useEffect(() => {
    if (!session?.user?.id || !otherUserId) return

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages?otherUserId=${otherUserId}`)
        const data = await response.json()
        console.log("Fetched messages:", data)
        if (data.messages) {
          setMessages(data.messages)
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error)
      }
    }

    fetchMessages()
  }, [session?.user?.id, otherUserId])

  // Set up Pusher subscription
  useEffect(() => {
    if (!chatId) return

    const channel = pusherClient.subscribe(`chat-${chatId}`)

    channel.bind("new-message", (data: any) => {
      setMessages((prev) => [...prev, data])
    })

    return () => {
      pusherClient.unsubscribe(`chat-${chatId}`)
    }
  }, [chatId])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !session?.user?.id || loading) return

    setLoading(true)
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          receiverId: otherUserId,
          telegramId,
        }),
      })
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return <div className="p-4 text-center">Please sign in to chat</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-lg h-96 flex flex-col">
      {/* Chat Header */}
      <div className="bg-green-600 text-white p-3 rounded-t-lg">
        <h3 className="font-semibold">Chat with {otherUserName}</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId._id === session.user?.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg ${
                message.senderId._id === session.user?.id ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">{new Date(message.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-3 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  )
}
