// "use client";

// import { useEffect, useState } from "react";
// import AdCard from "@/components/ads/AdCard";
// import Link from "next/link";
// import { useSession } from "next-auth/react";
// import { FiArrowLeft } from "react-icons/fi";

// // --- THIS IS THE UPDATED TYPE DEFINITION ---
// // It now matches the full, detailed Ad type used on the main marketplace page.
// type Ad = {
//   _id: string;
//   title: string;
//   price: number;
//   members: number;
//   ad_type: 'channel' | 'group' | 'account';
//   platform: 'telegram' | 'tiktok' | 'youtube';
//   category: string;
//   createdAt: string;
//   status: 'available' | 'sold';
//   seller: {
//     _id: string;
//     name: string;
//     image?: string;
//     likes: string[];
//     dislikes: string[];
//   };
// };
// // --- END OF UPDATE ---

// export default function MyAdsPage() {
//   const { data: session, status } = useSession();
//   const [myAds, setMyAds] = useState<Ad[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // This fetching logic is already correct and remains unchanged.
//     if (status === "authenticated") {
//       const fetchMyAds = async () => {
//         try {
//           const res = await fetch("/api/ads/my-ads");
//           if (res.ok) {
//             const data = await res.json();
//             setMyAds(data);
//           } else {
//             console.error("Failed to fetch user's ads");
//           }
//         } catch (error) {
//           console.error("An error occurred while fetching ads:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       fetchMyAds();
//     } else if (status === "unauthenticated") {
//       setIsLoading(false);
//     }
//   }, [status]);

//   if (isLoading || status === "loading") {
//     return <p className="text-center p-10 text-slate-400">Loading your listings...</p>;
//   }
  
//   if (status === "unauthenticated") {
//     return (
//         <div className="text-center p-10">
//             <h2 className="text-2xl font-bold text-white">Access Denied</h2>
//             <p className="text-slate-400 mt-2">Please <Link href="/auth/signin" className="text-blue-400 hover:underline">sign in</Link> to view your ads.</p>
//         </div>
//     );
//   }

//   // The JSX is also correct and remains unchanged.
//   return (
//     <div className="container mx-auto p-4 md:p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-white">My Ad Listings</h1>
//         <Link href="/ads" className="inline-flex items-center gap-2 text-slate-300 hover:text-blue-400">
//             <FiArrowLeft />
//             Back to Marketplace
//         </Link>
//       </div>

//       {myAds.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Reusing the AdCard component here is the key. It will now receive the full Ad object. */}
//           {myAds.map((ad) => (
//             <AdCard key={ad._id} ad={ad} />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center p-10 bg-slate-800 rounded-xl border border-slate-700">
//             <h3 className="text-xl font-bold text-white">You have not posted any ads yet.</h3>
//             <p className="text-slate-400 mt-2 mb-6">Ready to make a sale? Post your first ad now!</p>
//             <Link 
//                 href="/ads/new"
//                 className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
//             >
//                 Post an Ad
//             </Link>
//         </div>
//       )}
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import AdCard from "@/components/ads/AdCard";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FiArrowLeft } from "react-icons/fi";

// --- Ad Type Definition (remains the same) ---
type Ad = {
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
    image?: string;
    likes: string[];
    dislikes: string[];
  };
};
// --- END OF AD TYPE ---

export default function MyAdsPage() {
  const { data: session, status } = useSession();
  const [myAds, setMyAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchMyAds = async () => {
        try {
          const res = await fetch("/api/ads/my-ads");
          if (res.ok) {
            const data = await res.json();
            setMyAds(data);
          } else {
            console.error("Failed to fetch user's ads");
          }
        } catch (error) {
          console.error("An error occurred while fetching ads:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMyAds();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status]);

  if (isLoading || status === "loading") {
    // Updated Loading State
    return (
      <p className="text-center p-10 text-sky-400">
        Loading your listings...
      </p>
    );
  }
  
  if (status === "unauthenticated") {
    // Updated Access Denied State
    return (
        <div className="text-center p-10 bg-sky-900 rounded-xl max-w-lg mx-auto mt-10 border border-sky-800 shadow-2xl shadow-sky-950/20">
            <h2 className="text-2xl font-bold text-white">Access Denied</h2>
            <p className="text-slate-400 mt-2">
                Please <Link href="/auth/signin" className="text-sky-400 font-semibold hover:underline">sign in</Link> to view your ads.
            </p>
        </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-8">
        {/* Updated Heading style */}
        <h1 className="text-3xl font-extrabold text-white tracking-wide">My Active Listings</h1>
        {/* Updated Link style */}
        <Link 
            href="/ads" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors font-medium"
        >
            <FiArrowLeft className="h-5 w-5" />
            Back to Marketplace
        </Link>
      </div>

      {myAds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myAds.map((ad) => (
            <AdCard key={ad._id} ad={ad} />
          ))}
        </div>
      ) : (
        // Updated Empty State Card for a sleek, blue look
        <div className="text-center p-12 bg-sky-900 rounded-2xl border border-sky-700 shadow-xl shadow-sky-950/20 max-w-2xl mx-auto mt-10">
            <h3 className="text-2xl font-bold text-white">You have no listings yet.</h3>
            <p className="text-slate-400 mt-2 mb-8">Ready to make a sale? Post your first ad now!</p>
            <Link 
                href="/ads/new"
                // Match the primary accent button style from the homepage
                className="inline-block px-8 py-3 bg-sky-600 text-white font-extrabold rounded-full shadow-xl shadow-sky-500/40 hover:bg-sky-700 transform hover:-translate-y-0.5 transition-all duration-300 tracking-wider"
            >
                Post an Ad
            </Link>
        </div>
      )}
    </div>
  );
}