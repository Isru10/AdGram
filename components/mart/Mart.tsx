"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import CreateTelegramModal from "../telegram/create-telegram-modal"

interface TelegramItem {
  _id: string
  telegram_name: string
  price: number
  type: string
  members: number
  description?: string
  owner: {
    name: string
    email: string
  }
  createdAt: string
}

const Mart = () => {
  const { data: session } = useSession()
  const [items, setItems] = useState<TelegramItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState("all")

  const itemsPerPage = 10

  const fetchTelegrams = async () => {
    try {
      const response = await fetch("/api/telegram")
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error("Error fetching telegrams:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTelegrams()
  }, [])

  const filteredItems = items.filter((item) => filter === "all" || item.type === filter)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-white">Loading...</div>
  }

  return (
    <div className="flex flex-col bg-green-800 p-1 font-serif text-white">
      <h1 className="heading bg-green-700 text-white font-bold text-4xl items-center flex justify-center pt-4">
        Welcome to Al-Jo
      </h1>
      <div className="content bg-green-700 text-white p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="filters flex gap-4 p-4 bg-green-600 rounded-lg">
            <button
              onClick={() => setFilter("all")}
              className={`hover:bg-green-700 hover:rounded-full p-2 ${filter === "all" ? "bg-green-700 rounded-full" : ""}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("channel")}
              className={`hover:bg-green-700 hover:rounded-full p-2 ${filter === "channel" ? "bg-green-700 rounded-full" : ""}`}
            >
              Channels
            </button>
            <button
              onClick={() => setFilter("group")}
              className={`hover:bg-green-700 hover:rounded-full p-2 ${filter === "group" ? "bg-green-700 rounded-full" : ""}`}
            >
              Groups
            </button>
          </div>
          {session && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Create Telegram Ad
            </button>
          )}
        </div>

        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((item) => (
              <Link key={item._id} href={`/telegram/${item._id}`}>
                <div className="bg-green-600 p-4 rounded-lg shadow-lg hover:bg-green-700 transition-colors flex flex-col justify-between cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold capitalize">{item.telegram_name}</h2>
                      <p className="text-green-200 capitalize">Type: {item.type}</p>
                      {/* <p className="text-green-200 text-sm">By: {}</p> */}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Price: ${item.price}</p>
                      <p className="text-green-300">Members: {item.members}</p>
                    </div>
                  </div>
                  {item.description && <p className="text-green-200 text-sm mt-2 line-clamp-2">{item.description}</p>}
                  <div className="mt-3 pt-3 border-t border-green-500 flex justify-between items-center">
                    <p className="text-sm text-green-300 italic">{formatDate(item.createdAt)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded disabled:bg-green-800 disabled:cursor-not-allowed"
          >
            &laquo;
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded disabled:bg-green-800 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-white px-4">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded disabled:bg-green-800 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded disabled:bg-green-800 disabled:cursor-not-allowed"
          >
            &raquo;
          </button>
        </div>
      </div>

      <CreateTelegramModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchTelegrams}
      />
    </div>
  )
}

export default Mart
