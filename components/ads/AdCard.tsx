
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { FiUsers, FiTag, FiBox, FiArrowRight } from "react-icons/fi";
import { FaTelegramPlane, FaTiktok, FaYoutube } from "react-icons/fa";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// The type definition now includes the new `platform` field
type AdCardProps = {
  ad: {
    _id: string;
    title: string;
    price: number;
    members: number;
    ad_type: 'channel' | 'group' | 'account';
    platform: 'telegram' | 'tiktok' | 'youtube';
    category: string;
    createdAt: string;
    status: 'available' | 'sold';
    seller: {
      _id: string;
      name: string;
      likes: string[];
      dislikes: string[];
    };
  };
};

// Helper object to map platform names to their corresponding icons and colors
const platformConfig = {
  telegram: { icon: FaTelegramPlane, color: "text-sky-400" },
  tiktok: { icon: FaTiktok, color: "text-white" },
  youtube: { icon: FaYoutube, color: "text-red-500" },
};

export default function AdCard({ ad }: AdCardProps) {
  const { data: session } = useSession();
  const isSold = ad.status === 'sold';

  const [likes, setLikes] = useState(ad.seller.likes.length);
  const [dislikes, setDislikes] = useState(ad.seller.dislikes.length);
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      if (ad.seller.likes.includes(session.user.id)) {
        setUserVote('like');
      } else if (ad.seller.dislikes.includes(session.user.id)) {
        setUserVote('dislike');
      } else {
        setUserVote(null);
      }
    }
    setLikes(ad.seller.likes.length);
    setDislikes(ad.seller.dislikes.length);
  }, [ad.seller, session?.user?.id]);

  const handleVote = async (voteType: 'like' | 'dislike') => {
    if (!session) {
      toast.error("Please sign in to vote.");
      return;
    }
    if (isVoting) return;
    setIsVoting(true);

    const originalState = { likes, dislikes, userVote };
    
    let newLikes = likes;
    let newDislikes = dislikes;
    let newUserVote: 'like' | 'dislike' | null = null;
    
    if (voteType === 'like') {
        if (userVote === 'like') {
            newLikes--;
            newUserVote = null;
        } else {
            newLikes++;
            if (userVote === 'dislike') newDislikes--;
            newUserVote = 'like';
        }
    } else {
        if (userVote === 'dislike') {
            newDislikes--;
            newUserVote = null;
        } else {
            newDislikes++;
            if (userVote === 'like') newLikes--;
            newUserVote = 'dislike';
        }
    }

    setLikes(newLikes);
    setDislikes(newDislikes);
    setUserVote(newUserVote);

    try {
      const res = await fetch(`/api/users/${ad.seller._id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to cast vote.");
      }
    } catch (error: any) {
      toast.error(error.message);
      // Rollback UI on error
      setLikes(originalState.likes);
      setDislikes(originalState.dislikes);
      setUserVote(originalState.userVote);
    } finally {
      setIsVoting(false);
    }
  };
  
  // Get the correct icon component and color based on the ad's platform
  const PlatformIcon = platformConfig[ad.platform]?.icon || FaTelegramPlane;
  const platformColor = platformConfig[ad.platform]?.color || "text-white";

  return (
    <div className={cn("relative rounded-xl border flex flex-col p-6 h-full transition-transform", isSold ? 'bg-slate-800/50 border-slate-700/50 cursor-not-allowed' : 'bg-slate-800 border-slate-700 hover:-translate-y-1')}>
      {isSold && <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">SOLD</div>}
      
      <div className={cn("absolute top-4 left-4 w-8 h-8 rounded-lg flex items-center justify-center", isSold ? 'opacity-50' : '')}>
        <PlatformIcon className={cn("h-5 w-5", platformColor)} />
      </div>

      <div className={cn(isSold ? 'opacity-50' : '')}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-white text-center w-full pt-2">{ad.title}</h3>
          <span className={cn("flex-shrink-0 text-white text-lg font-bold px-3 py-1 rounded-md", isSold ? 'bg-red-800/70' : 'bg-blue-600')}>${ad.price.toLocaleString()}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-slate-400 mb-6">
          <div className="flex items-center gap-2"><FiUsers className="text-blue-400" /><span>{ad.members.toLocaleString()} Members</span></div>
          <div className="flex items-center gap-2"><FiTag className="text-blue-400" /><span className="truncate">{ad.category}</span></div>
          <div className="flex items-center gap-2 col-span-2"><FiBox className="text-blue-400" /><span className="capitalize">{ad.ad_type}</span></div>
        </div>
      </div>
      
      <div className="flex-grow"></div>

      <div className={cn("pt-4 border-t", isSold ? 'border-slate-700/50' : 'border-slate-700')}>
        <div className={cn("flex justify-between items-center", isSold ? 'opacity-50' : '')}>
          <div>
            <span className="text-sm text-slate-500">Seller: {ad.seller.name}</span>
            <span className="text-xs text-slate-600 mt-1 block">
              Posted {formatDistanceToNow(new Date(ad.createdAt), { addSuffix: true })}
            </span>
          </div>
          <Link href={`/ads/${ad._id}`} className="group inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
            View Details
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        {!isSold && (
          <div className="mt-4 flex items-center justify-end space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('like')}
              disabled={isVoting || ad.seller._id === session?.user?.id}
              className={cn(
                "flex items-center gap-2",
                userVote === 'like' ? 'text-green-400 hover:text-green-500' : 'text-slate-400 hover:text-white'
              )}
            >
              <ThumbsUp size={16} /> {likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('dislike')}
              disabled={isVoting || ad.seller._id === session?.user?.id}
              className={cn(
                "flex items-center gap-2",
                userVote === 'dislike' ? 'text-red-400 hover:text-red-500' : 'text-slate-400 hover:text-white'
              )}
            >
              <ThumbsDown size={16} /> {dislikes}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}