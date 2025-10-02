// "use client";

// import { useEffect, useState, useCallback } from "react";
// import AdCard from "@/components/ads/AdCard";
// import FilterControls, { type Filters } from "@/components/ads/FilterControls";
// import Image from "next/image";
// import type { SponsoredAd as SponsoredAdType } from "@/types";

// // --- DYNAMIC SPONSORED AD COMPONENT ---
// // This component accepts props with the ad's data.
// type SponsoredAdProps = {
//   ad: SponsoredAdType;
// };

// const SponsoredAd = ({ ad }: SponsoredAdProps) => (
//   <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
//     <div className="relative h-32 w-full">
//       <Image
//         src={ad.imageUrl} // Use the dynamic image URL from the data
//         alt={ad.companyName} 
//         layout="fill" 
//         objectFit="cover" 
//       />
//     </div>
//     <div className="p-4 text-center">
//       <span className="text-xs font-bold text-yellow-400 bg-yellow-900/50 px-2 py-1 rounded-full">Sponsored</span>
//       <h4 className="text-white font-bold mt-4">{ad.companyName}</h4>
//       <p className="text-slate-400 text-sm mt-2">{ad.description}</p>
//       <a href={ad.destinationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm font-semibold mt-4 inline-block hover:underline">
//         Learn More
//       </a>
//     </div>
//   </div>
// );
// // --- END OF SPONSORED AD COMPONENT ---

// // Main Ad type for the marketplace listings, this is correct
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

// export default function AdsListPage() {
//   const [ads, setAds] = useState<Ad[]>([]);
//   const [sponsoredAds, setSponsoredAds] = useState<SponsoredAdType[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   const [filters, setFilters] = useState<Filters>({
//     platform: 'all',
//     category: 'all',
//     sortBy: 'createdAt',
//     sortOrder: 'desc',
//     includeSold: false,
//   });

//   // Effect to fetch all necessary data for the page based on filters
//   useEffect(() => {
//     const fetchAllData = async () => {
//         setIsLoading(true);
//         try {
//             // --- THIS IS THE UPDATED FETCH URL ---
//             // Fetch sponsored ads from the NEW PUBLIC endpoint.
//             const sponsoredRes = fetch('/api/sponsored-ads'); 
            
//             // Fetch regular ads with current filters
//             const params = new URLSearchParams();
//             if (filters.platform !== 'all') params.append('platform', filters.platform);
//             if (filters.category !== 'all') params.append('category', filters.category);
//             params.append('sortBy', filters.sortBy);
//             params.append('sortOrder', filters.sortOrder);
//             if (filters.includeSold) params.append('includeSold', 'true');
//             const adsRes = fetch(`/api/ads?${params.toString()}`);

//             // Wait for both fetches to complete concurrently
//             const [sponsoredResponse, adsResponse] = await Promise.all([sponsoredRes, adsRes]);

//             if (sponsoredResponse.ok) {
//                 const sponsoredData = await sponsoredResponse.json();
//                 setSponsoredAds(sponsoredData);
//             } else {
//                 // If fetching sponsored ads fails for any reason, just clear the array
//                 setSponsoredAds([]);
//             }

//             if (adsResponse.ok) {
//                 const adsData = await adsResponse.json();
//                 setAds(adsData);
//             }

//         } catch (error) {
//             console.error("Failed to fetch page data:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };
    
//     fetchAllData();
//   }, [filters]);
  
//   // Callback function to update filters from the child component
//   const handleFilterChange = (newFilters: Filters) => {
//     setFilters(newFilters);
//   };

//   // Since the API now only returns active ads, we don't strictly need to filter again,
//   // but it's safe to keep. The slice is still important to enforce the limit.
//   const activeSponsoredAds = sponsoredAds.slice(0, 2);

//   return (
//     <div className="container mx-auto p-4 md:p-6">
//       <h1 className="text-3xl font-bold mb-6 text-white">Marketplace</h1>
      
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
//         <div className="lg:col-span-3">
//           <FilterControls onFilterChange={handleFilterChange} />
//           {isLoading ? (
//             <p className="text-center p-10 text-slate-400">Loading listings...</p>
//           ) : ads.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {ads.map((ad) => (
//                 <AdCard key={ad._id} ad={ad} />
//               ))}
//             </div>
//           ) : (
//             <p className="text-center p-10 text-slate-400">No ads found matching your criteria. Try adjusting your filters.</p>
//           )}
//         </div>

//         <aside className="lg:col-span-1">
//           <div className="sticky top-24 space-y-6">
//             <h3 className="font-bold text-white border-b border-slate-700 pb-2">Sponsored</h3>
//             {activeSponsoredAds.length > 0 ? (
//               activeSponsoredAds.map((sponsoredAd) => (
//                 <SponsoredAd key={sponsoredAd._id} ad={sponsoredAd} />
//               ))
//             ) : (
//               <div className="text-center text-sm text-slate-500 bg-slate-800 rounded-xl p-4 border border-slate-700">
//                 Advertise here.
//               </div>
//             )}
//           </div>
//         </aside>

//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState, useCallback } from "react";
import AdCard from "@/components/ads/AdCard";
import FilterControls, { type Filters } from "@/components/ads/FilterControls";
import Image from "next/image";
import type { SponsoredAd as SponsoredAdType } from "@/types";

// --- DYNAMIC SPONSORED AD COMPONENT ---
type SponsoredAdProps = {
  ad: SponsoredAdType;
};

const SponsoredAd = ({ ad }: SponsoredAdProps) => (
  // Updated background and border to match the deep-blue dark theme
  <div className="bg-sky-900 rounded-xl border border-sky-800 overflow-hidden shadow-lg shadow-sky-950/20">
    <div className="relative h-32 w-full">
      <Image
        src={ad.imageUrl} 
        alt={ad.companyName} 
        layout="fill" 
        objectFit="cover" 
      />
    </div>
    <div className="p-4 text-center">
      {/* Accent color for the 'Sponsored' tag */}
      <span className="text-xs font-bold text-amber-300 bg-amber-900/50 px-2 py-1 rounded-full tracking-wider">Sponsored</span>
      <h4 className="text-white font-bold mt-4">{ad.companyName}</h4>
      <p className="text-slate-400 text-sm mt-2">{ad.description}</p>
      {/* Accent color for the link */}
      <a href={ad.destinationUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 text-sm font-semibold mt-4 inline-block hover:underline">
        Learn More
      </a>
    </div>
  </div>
);
// --- END OF SPONSORED AD COMPONENT ---

// Main Ad type for the marketplace listings
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

export default function AdsListPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [sponsoredAds, setSponsoredAds] = useState<SponsoredAdType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState<Filters>({
    platform: 'all',
    category: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    includeSold: false,
  });

  // Effect to fetch all necessary data for the page based on filters
  useEffect(() => {
    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            // Fetch sponsored ads
            const sponsoredRes = fetch('/api/sponsored-ads'); 
            
            // Fetch regular ads with current filters
            const params = new URLSearchParams();
            if (filters.platform !== 'all') params.append('platform', filters.platform);
            if (filters.category !== 'all') params.append('category', filters.category);
            params.append('sortBy', filters.sortBy);
            params.append('sortOrder', filters.sortOrder);
            if (filters.includeSold) params.append('includeSold', 'true');
            const adsRes = fetch(`/api/ads?${params.toString()}`);

            // Wait for both fetches to complete concurrently
            const [sponsoredResponse, adsResponse] = await Promise.all([sponsoredRes, adsRes]);

            if (sponsoredResponse.ok) {
                const sponsoredData = await sponsoredResponse.json();
                setSponsoredAds(sponsoredData);
            } else {
                setSponsoredAds([]);
            }

            if (adsResponse.ok) {
                const adsData = await adsResponse.json();
                setAds(adsData);
            }

        } catch (error) {
            console.error("Failed to fetch page data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchAllData();
  }, [filters]);
  
  // Callback function to update filters from the child component
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const activeSponsoredAds = sponsoredAds.slice(0, 2);

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Updated Heading style to match the dark theme */}
      <h1 className="text-3xl font-extrabold mb-6 text-white tracking-wide">Listings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-3">
          {/* FilterControls (now with cool blue styling applied internally) */}
          <FilterControls onFilterChange={handleFilterChange} /> 
          
          {isLoading ? (
            // Updated loading state style
            <div className="text-center p-10 text-sky-400 bg-sky-900 rounded-xl mt-6 animate-pulse">
                <p>Loading listings...</p>
            </div>
          ) : ads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* AdCard component needs to handle its own dark theme styling */}
              {ads.map((ad) => (
                <AdCard key={ad._id} ad={ad} />
              ))}
            </div>
          ) : (
            // Updated empty state style
            <p className="text-center p-10 text-slate-400 bg-sky-900 rounded-xl mt-6 border border-sky-800">No ads found matching your criteria. Try adjusting your filters.</p>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Updated section header */}
            <h3 className="font-bold text-white border-b-2 border-sky-600 pb-2 tracking-wider">Sponsored Ads</h3>
            {activeSponsoredAds.length > 0 ? (
              activeSponsoredAds.map((sponsoredAd) => (
                <SponsoredAd key={sponsoredAd._id} ad={sponsoredAd} />
              ))
            ) : (
              // Updated background and border for the empty ad slot
              <div className="text-center text-sm text-slate-500 bg-sky-900 rounded-xl p-4 border border-sky-800">
                Advertise here to reach thousands of buyers.
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}