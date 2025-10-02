"use client"
import type React from "react"
import { useState } from "react"
import { useSession } from "next-auth/react"

interface CreateTelegramModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const CreateTelegramModal = ({ isOpen, onClose, onSuccess }: CreateTelegramModalProps) => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [telegram_name, setTelegramName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(1)
  const [type, setType] = useState("channel")
  const [members, setMembers] = useState(1)

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    setLoading(true)
    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegram_name,
          description,
          price,
          type,
          members,
          
        }),
      })

      if (response.ok) {
        onSuccess()
        onClose()
        setTelegramName("")
        setDescription("")
        setPrice(0)
        setType("channel")
        setMembers(0)
    }
    } catch (error) {
      console.error("Error creating telegram:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-green-700 p-6 rounded-lg w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-4">Create Telegram Ad</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Channel/Group Name"
            value={telegram_name}
            onChange={(e) => 
              setTelegramName(e.target.value)
            }
            className="w-full p-2 rounded bg-green-600 text-white placeholder-green-200"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => 
              setDescription(e.target.value)
            }
            className="w-full p-2 rounded bg-green-600 text-white placeholder-green-200"
            rows={3}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => 
              setPrice(parseInt(e.target.value))
            }
            className="w-full p-2 rounded bg-green-600 text-white placeholder-green-200"
            required
          />
          <select
            value={type}
            onChange={(e) => 
              setType(e.target.value)}
            className="w-full p-2 rounded bg-green-600 text-white"
          >
            <option value="channel">Channel</option>
            <option value="group">Group</option>
          </select>
          <input
            type="number"
            placeholder="Members (e.g., 5k)"
            value={members}
            onChange={(e) => 
            
              setMembers(parseInt(e.target.value))
            }
            className="w-full p-2 rounded bg-green-600 text-white placeholder-green-200"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-500 hover:bg-green-400 p-2 rounded font-bold disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Ad"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-red-600 hover:bg-red-500 p-2 rounded font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTelegramModal
