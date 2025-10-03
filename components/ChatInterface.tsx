// "use client"
// import { useState, useEffect, useRef } from "react"
// import type React from "react"

// import { useSession } from "next-auth/react"
// import { pusherClient } from "@/lib/pusher"
// import type { MessageWithSender } from "@/types"

// interface ChatInterfaceProps {
//   conversationId: string
//   adTitle: string
// }

// export default function ChatInterface({ conversationId, adTitle }: ChatInterfaceProps) {
//   const { data: session } = useSession()
//   const [messages, setMessages] = useState<MessageWithSender[]>([])
//   const [newMessage, setNewMessage] = useState("")
//   const [loading, setLoading] = useState(true)
//   const messagesEndRef = useRef<HTMLDivElement>(null)

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   const fetchMessages = async () => {
//     try {
//       const response = await fetch(`/api/conversations/${conversationId}/messages`)
//       if (response.ok) {
//         const data = await response.json()
//         setMessages(data)
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchMessages()

//     const channel = pusherClient.subscribe(`conversation-${conversationId}`)
//     channel.bind("new-message", (data: { message: MessageWithSender }) => {
//       setMessages((prev) => [...prev, data.message])
//     })

//     return () => {
//       pusherClient.unsubscribe(`conversation-${conversationId}`)
//     }
//   }, [conversationId])

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages])

//   const sendMessage = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!newMessage.trim()) return

//     try {
//       const response = await fetch(`/api/conversations/${conversationId}/messages`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content: newMessage }),
//       })

//       if (response.ok) {
//         setNewMessage("")
//       }
//     } catch (error) {
//       console.error("Error sending message:", error)
//     }
//   }

//   if (loading) {
//     return <div className="flex justify-center p-4">Loading messages...</div>
//   }

//   return (
//     <div className="flex flex-col h-96 bg-white rounded-lg shadow-md">
//       <div className="bg-gray-50 px-4 py-3 border-b rounded-t-lg">
//         <h3 className="font-semibold text-gray-900">Chat about: {adTitle}</h3>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {messages.map((message) => (
//           <div
//             // FIX 1: Convert the `_id` object to a string for the key prop.
//             key={message._id.toString()}
//             className={`flex ${message.senderId._id === session?.user?.id ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                 message.senderId._id === session?.user?.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
//               }`}
//             >
//               <p className="text-sm">{message.content}</p>
//               {/* FIX 2: Convert the `createdAt` Date object to a readable string. */}
//               <p className="text-xs opacity-75 mt-1">{new Date(message.createdAt).toLocaleString()}</p>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <form onSubmit={sendMessage} className="border-t p-4">
//         <div className="flex space-x-2">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type your message..."
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             type="submit"
//             disabled={!newMessage.trim()}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
//           >
//             Send
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }



"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { useSession } from "next-auth/react"
import { pusherClient } from "@/lib/pusher"
// --- REMOVE THIS LINE: import type { MessageWithSender } from "@/types"

/* eslint-disable @typescript-eslint/no-explicit-any */
// Define the type the component expects based on its usage
type Sender = {
    _id: string;
    name: string;
    image?: string;
};

// Define the type for a message received via API or Pusher
type MessageWithSender = {
    _id: string;
    content: string;
    // NOTE: Based on usage like message.senderId._id, we define senderId here
    senderId: Sender; 
    createdAt: string; 
};

interface ChatInterfaceProps {
  conversationId: string
  adTitle: string
}

export default function ChatInterface({ conversationId, adTitle }: ChatInterfaceProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchMessages = async () => {
    try {
      // NOTE: Update this API route to the correct one if needed
      const response = await fetch(`/api/conversations/${conversationId}/messages`)
      if (response.ok) {
        const data = await response.json() as MessageWithSender[]; // Cast the data
        setMessages(data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()

    // The type cast here is necessary because the data comes from an external source (Pusher)
    const channel = pusherClient.subscribe(`conversation-${conversationId}`)
    channel.bind("new-message", (data: { message: any }) => {
      // We must cast the incoming data to our expected type
      setMessages((prev) => [...prev, data.message as MessageWithSender])
    })

    return () => {
      pusherClient.unsubscribe(`conversation-${conversationId}`)
    }
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      // NOTE: Update this API route to the correct one if needed
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      })

      if (response.ok) {
        setNewMessage("")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading messages...</div>
  }

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg shadow-md">
      <div className="bg-gray-50 px-4 py-3 border-b rounded-t-lg">
        <h3 className="font-semibold text-gray-900">Chat about: {adTitle}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            // FIX: Convert the _id to a string for the key prop.
            key={message._id.toString()}
            // FIX: Check message.senderId._id against session?.user?.id
            className={`flex ${message.senderId._id === session?.user?.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId._id === session?.user?.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {/* FIX: Convert the Date object to a readable string. */}
              <p className="text-xs opacity-75 mt-1">{new Date(message.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}