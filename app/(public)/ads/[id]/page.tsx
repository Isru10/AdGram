"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ChatInbox from "@/components/chat/ChatInbox";
// 1. Import the FiTrash2 icon for the delete button
import { FiUsers, FiTag, FiBox, FiCalendar, FiLink, FiArrowLeft, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

// 2. Update the type definition to include the `status` field
type AdDetails = {
  _id: string;
  title: string;
  description: string;
  price: number;
  members: number;
  openedIn: number;
  ad_type: 'channel' | 'group';
  category: string;
  link: string;
  status: 'available' | 'sold'; // Add this line
  seller: { _id: string; name: string };
};

type Chat = {
  _id: string;
  buyer: { _id: string; name: string; image?: string };
};

export default function AdDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: session } = useSession();
  const router = useRouter();
  const [ad, setAd] = useState<AdDetails | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // 3. Add a new loading state for the delete action
  const [isDeleting, setIsDeleting] = useState(false);

  // This useEffect hook is correct and remains the same
  useEffect(() => {
    if (!id) return;
    const fetchAdDetails = async () => {
      try {
        const res = await fetch(`/api/ads/${id}`);
        if (!res.ok) throw new Error("Ad not found");
        const data = await res.json();
        setAd(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdDetails();
  }, [id]);

  // This useEffect hook is also correct and remains the same
  useEffect(() => {
    if (session && ad && session.user.id === ad.seller._id) {
      const fetchChatsForAd = async () => {
        const res = await fetch(`/api/ads/${ad._id}/chats`);
        if (res.ok) {
          const data = await res.json();
          setChats(data);
        }   
      };
      fetchChatsForAd();
    }
  }, [session, ad]);

  // The handleStartChat function is also correct and remains the same
  const handleStartChat = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId: ad?._id }),
      });
      const chat = await res.json();
      if (res.ok) {
        router.push(`/chats/${chat._id}`);
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  // 4. Add the new handler function for the delete button
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to permanently delete this ad? This action cannot be undone.");
    
    if (confirmed) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/ads/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to delete ad.");
        }
        alert("Ad deleted successfully.");
        router.push("/ads");
      } catch (error: any) {
        console.error("Deletion failed:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) return <div className="text-center p-10 text-slate-400">Loading ad...</div>;
  if (!ad) return <div className="text-center p-10 text-slate-400">Ad not found.</div>;

  const isOwner = session?.user?.id === ad.seller._id;

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6">
      <Link href="/ads" className="inline-flex items-center gap-2 text-slate-300 hover:text-blue-400 mb-6">
        <FiArrowLeft />
        Back to Marketplace
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-slate-800 p-8 rounded-xl border border-slate-700">
          <h1 className="text-3xl font-bold text-white">{ad.title}</h1>
          <p className="mt-4 text-slate-300 whitespace-pre-wrap">{ad.description}</p>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="text-4xl font-bold text-white mb-6">${ad.price.toLocaleString()}</div>
            <div className="space-y-4 text-slate-300">
              <div className="flex items-center gap-3"><FiUsers className="text-blue-400" size={20} /><span>{ad.members.toLocaleString()} Members</span></div>
              <div className="flex items-center gap-3"><FiCalendar className="text-blue-400" size={20} /><span>Opened in {ad.openedIn}</span></div>
              <div className="flex items-center gap-3"><FiBox className="text-blue-400" size={20} /><span className="capitalize">{ad.ad_type}</span></div>
              <div className="flex items-center gap-3"><FiTag className="text-blue-400" size={20} /><span>{ad.category}</span></div>
              <div className="flex items-center gap-3"><FiLink className="text-blue-400" size={20} /><a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate">{ad.link}</a></div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-700 text-sm text-slate-500">
              Seller: {ad.seller.name}
            </div>
          </div>
          
          {/* Update button logic to only show Contact button if the ad is available */}
          {!isOwner && ad.status === 'available' && (
            <button onClick={handleStartChat} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md shadow-blue-500/30 hover:bg-blue-700 transition-colors">
              Contact Seller
            </button>
          )}

          {/* Show a disabled "Sold" button if the ad is sold and user is not the owner */}
          {!isOwner && ad.status === 'sold' && (
            <button disabled className="w-full py-3 bg-red-800/50 text-white font-bold rounded-lg cursor-not-allowed">
              This item has been sold
            </button>
          )}

          {/* 5. Add the "Delete Ad" button, visible only to the owner */}
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-800/50 text-red-300 font-bold rounded-lg hover:bg-red-800/80 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              <FiTrash2 />
              {isDeleting ? "Deleting..." : "Delete Ad"}
            </button>
          )}
        </div>
      </div>

      {isOwner && <div className="mt-8"><ChatInbox chats={chats} adId={ad._id} /></div>}
    </div>
  );
}