"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface Conversation {
  _id: string
  adId: {
    _id: string
    title: string
  }
  participants: Array<{
    _id: string
    name: string
    email: string
  }>
  lastMessage?: {
    content: string
    createdAt: string
  }
  lastMessageAt: string
  isOwner: boolean
}

interface ConversationsResponse {
  conversations: Conversation[]
  ownedConversations: Conversation[]
  nonOwnedConversations: Conversation[]
}

export default function InboxPage() {
  const { data: session } = useSession()
  const [conversationsData, setConversationsData] = useState<ConversationsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchConversations()
    }
  }, [session])

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations")
      if (response.ok) {
        const data = await response.json()
        setConversationsData(data)
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <p className="text-center text-gray-600">Please sign in to view your inbox.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="flex justify-center mt-8">Loading conversations...</div>
  }

  if (!conversationsData || conversationsData.conversations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6">
        <h1 className="text-2xl font-bold mb-6">Your Conversations</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No conversations yet.</p>
          <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
            Browse ads to start chatting
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Your Conversations</h1>

      {conversationsData.ownedConversations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Your Ads - People contacting you</h2>
          <div className="space-y-4">
            {conversationsData.ownedConversations.map((conversation) => {
              const otherParticipant = conversation.participants.find((p) => p.email !== session.user?.email)

              return (
                <Link
                  key={conversation._id}
                  href={`/conversations/${conversation._id}`}
                  className="block bg-green-50 border border-green-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{conversation.adId.title}</h3>
                      <p className="text-sm text-green-700 mb-2">
                        💬 {otherParticipant?.name || "Unknown User"} wants to chat
                      </p>
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage.content}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(conversation.lastMessageAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {conversationsData.nonOwnedConversations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Your Chats - Ads youre interested in</h2>
          <div className="space-y-4">
            {conversationsData.nonOwnedConversations.map((conversation) => {
              const otherParticipant = conversation.participants.find((p) => p.email !== session.user?.email)

              return (
                <Link
                  key={conversation._id}
                  href={`/conversations/${conversation._id}`}
                  className="block bg-blue-50 border border-blue-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{conversation.adId.title}</h3>
                      <p className="text-sm text-blue-700 mb-2">Chat with {otherParticipant?.name || "Unknown User"}</p>
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage.content}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(conversation.lastMessageAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
