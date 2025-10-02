"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ChatInbox from "@/components/chat/ChatInbox";
// Import the same icons for consistency
import { FiUsers, FiTag, FiBox, FiCalendar, FiLink, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

// Update the types to match the full Ad model
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
  seller: { _id: string; name: string };
};

type Chat = {
  _id: string;
  buyer: { _id:string; name: string; image?: string };
};

export default function AdDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [ad, setAd] = useState<AdDetails | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchAdDetails = async () => {
      try {
        const res = await fetch(`/api/ads/${id}`);
        if (!res.ok) throw new Error("Ad not found");
        setAd(await res.json());
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdDetails();
  }, [id]);

  useEffect(() => {
    if (session && ad && session.user.id === ad.seller._id) {
      const fetchChatsForAd = async () => {
        const res = await fetch(`/api/ads/${ad._id}/chats`);
        if (res.ok) setChats(await res.json());
      };
      fetchChatsForAd();
    }
  }, [session, ad]);

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
      if (res.ok) router.push(`/chats/${chat._id}`);
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  if (isLoading) return <div className="text-center p-10">Loading ad...</div>;
  if (!ad) return <div className="text-center p-10">Ad not found.</div>;

  const isOwner = session?.user?.id === ad.seller._id;

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6">
      <Link href="/ads" className="inline-flex items-center gap-2 text-slate-300 hover:text-blue-400 mb-6">
        <FiArrowLeft />
        Back to Marketplace
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 bg-slate-800 p-8 rounded-xl border border-slate-700">
          <h1 className="text-3xl font-bold text-white">{ad.title}</h1>
          <p className="mt-4 text-slate-300 whitespace-pre-wrap">{ad.description}</p>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="text-4xl font-bold text-white mb-6">${ad.price}</div>
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
          {!isOwner && (
            <button onClick={handleStartChat} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md shadow-blue-500/30 hover:bg-blue-700 transition-colors">
              Contact Seller
            </button>
          )}
        </div>
      </div>

      {isOwner && <div className="mt-8"><ChatInbox chats={chats} adId={ad._id} /></div>}
    </div>
  );
}