// "use client";

// import { useState, useEffect } from 'react';
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { FaTelegramPlane, FaTiktok, FaYoutube } from "react-icons/fa";
// import { Sparkles } from 'lucide-react';

// // The type definition for the filters object
// export type Filters = {
//   platform: 'all' | 'telegram' | 'tiktok' | 'youtube';
//   category: string;
//   sortBy: 'createdAt' | 'price' | 'members';
//   sortOrder: 'asc' | 'desc';
//   includeSold: boolean;
// };

// // The type definition for the component's props
// type FilterControlsProps = {
//   onFilterChange: (filters: Filters) => void;
// };

// export default function FilterControls({ onFilterChange }: FilterControlsProps) {
//   // State for all the active filter values
//   const [filters, setFilters] = useState<Filters>({
//     platform: 'all',
//     category: 'all',
//     sortBy: 'createdAt',
//     sortOrder: 'desc',
//     includeSold: false,
//   });

//   // State to hold the list of categories fetched from the API
//   const [categories, setCategories] = useState<string[]>([]);

//   // Effect that communicates any filter changes up to the parent page
//   useEffect(() => {
//     onFilterChange(filters);
//   }, [filters, onFilterChange]);

//   // Effect that runs once on mount to fetch the dynamic category list
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch('/api/ads/categories');
//         if (res.ok) {
//           const data = await res.json();
//           setCategories(data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch categories:", error);
//       }
//     };
    
//     fetchCategories();
//   }, []); // Empty dependency array ensures this runs only once

//   // Handler functions for updating the filter state
//   const handlePlatformChange = (value: Filters['platform']) => {
//     if (value) {
//       setFilters((prev) => ({ ...prev, platform: value }));
//     }
//   };

//   const handleCategoryChange = (value: string) => {
//     setFilters((prev) => ({ ...prev, category: value }));
//   };
  
//   const handleSortChange = (value: string) => {
//     const [sortBy, sortOrder] = value.split('-') as [Filters['sortBy'], Filters['sortOrder']];
//     setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
//   };

//   const handleIncludeSoldChange = (checked: boolean) => {
//     setFilters((prev) => ({ ...prev, includeSold: checked }));
//   };

//   return (
//     <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-8 space-y-4">
//       {/* Top row with platform and sorting */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-start md:gap-x-8 gap-y-4">
        
//         <ToggleGroup
//           type="single"
//           defaultValue="all"
//           value={filters.platform}
//           onValueChange={handlePlatformChange}
//           aria-label="Filter by platform"
//           className="w-full md:w-auto gap-1"
//         >
//           <ToggleGroupItem value="all" aria-label="All platforms" className="w-full md:w-auto"><Sparkles className="h-4 w-4 mr-2"/>All</ToggleGroupItem>
//           <ToggleGroupItem value="telegram" aria-label="Telegram" className="w-full md:w-auto"><FaTelegramPlane className="h-4 w-4 mr-2"/>Telegram</ToggleGroupItem>
//           <ToggleGroupItem value="tiktok" aria-label="TikTok" className="w-full md:w-auto"><FaTiktok className="h-4 w-4 mr-2"/>TikTok</ToggleGroupItem>
//           <ToggleGroupItem value="youtube" aria-label="YouTube" className="w-full md:w-auto"><FaYoutube className="h-4 w-4 mr-2"/>YouTube</ToggleGroupItem>
//         </ToggleGroup>
        
//         <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={handleSortChange}>
//           <SelectTrigger className="w-full md:w-[200px] flex-shrink-0 md:ml-auto">
//             <SelectValue placeholder="Sort by..." />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="createdAt-desc">Newest First</SelectItem>
//             <SelectItem value="price-desc">Price: High to Low</SelectItem>
//             <SelectItem value="price-asc">Price: Low to High</SelectItem>
//             <SelectItem value="members-desc">Members: High to Low</SelectItem>
//             <SelectItem value="members-asc">Members: Low to High</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
      
//       {/* Bottom row for category and other options */}
//       <div className="border-t border-slate-700 pt-4 flex flex-col md:flex-row md:items-center md:justify-start md:gap-x-8 gap-y-4">
        
//         <Select value={filters.category} onValueChange={handleCategoryChange}>
//           <SelectTrigger className="w-full md:w-[200px]">
//             <SelectValue placeholder="Filter by category..." />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Categories</SelectItem>
//             {/* Map over the fetched categories to create the options */}
//             {categories.map((cat) => (
//               <SelectItem key={cat} value={cat}>{cat}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
        
//         <div className="flex items-center space-x-2 md:ml-auto">
//           <Checkbox 
//             id="includeSold" 
//             checked={filters.includeSold} 
//             onCheckedChange={handleIncludeSoldChange}
//           />
//           <Label htmlFor="includeSold" className="text-sm font-medium text-slate-300">
//             Include Sold Listings
//           </Label>
//         </div>
        
//       </div>
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from 'react';
// Assuming these are Shadcn UI components (or similar)
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FaTelegramPlane, FaTiktok, FaYoutube } from "react-icons/fa";
import { Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils"; // Assuming this utility is available

// The type definition for the filters object (kept the same)
export type Filters = {
  platform: 'all' | 'telegram' | 'tiktok' | 'youtube';
  category: string;
  sortBy: 'createdAt' | 'price' | 'members';
  sortOrder: 'asc' | 'desc';
  includeSold: boolean;
};

// The type definition for the component's props (kept the same)
type FilterControlsProps = {
  onFilterChange: (filters: Filters) => void;
};

// --- Custom Styles for Toggle Group Items ---
const toggleItemStyle = (isActive: boolean) => cn(
  "h-auto px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200",
  "data-[state=off]:bg-sky-900 data-[state=off]:text-slate-400 data-[state=off]:border data-[state=off]:border-sky-800",
  "data-[state=on]:bg-sky-600 data-[state=on]:text-white data-[state=on]:font-bold data-[state=on]:shadow-lg data-[state=on]:shadow-sky-500/40",
  "hover:bg-sky-700 hover:text-white"
);

// --- Custom Styles for Select Trigger ---
// NOTE: You may need to update the actual Shadcn component file if these don't apply correctly.
const selectTriggerStyle = "w-full md:w-[200px] bg-sky-950 text-slate-200 border border-sky-700 rounded-lg focus:ring-sky-500 focus:border-sky-500 flex-shrink-0";
// The SelectContent, SelectItem styles will be inherited/default, which should be dark-themed for Shadcn/Radix UI.

// --- Custom Styles for Checkbox ---
// NOTE: You may need to update the actual Shadcn component file if these don't apply correctly.
const checkboxStyle = "border-sky-600 data-[state=checked]:bg-sky-600 data-[state=checked]:text-white focus-visible:ring-sky-500";


export default function FilterControls({ onFilterChange }: FilterControlsProps) {
  // State logic remains the same
  const [filters, setFilters] = useState<Filters>({
    platform: 'all',
    category: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    includeSold: false,
  });

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/ads/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    
    fetchCategories();
  }, []);

  // Handler functions remain the same
  const handlePlatformChange = (value: Filters['platform']) => {
    if (value) {
      setFilters((prev) => ({ ...prev, platform: value }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }));
  };
  
  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [Filters['sortBy'], Filters['sortOrder']];
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  const handleIncludeSoldChange = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, includeSold: checked }));
  };

  return (
    // Updated Container for a cool, dark blue look
    <div className="bg-sky-900 p-4 rounded-xl shadow-2xl shadow-sky-950/20 space-y-4 border border-sky-800">
      
      {/* Platform and Sorting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-start md:gap-x-8 gap-y-4">
        
        {/* Platform Filter - Using the new sleek button style */}
        <ToggleGroup
          type="single"
          defaultValue="all"
          value={filters.platform}
          onValueChange={handlePlatformChange}
          aria-label="Filter by platform"
          className="w-full md:w-auto flex-wrap gap-2" // Added flex-wrap and gap-2 for better mobile layout
        >
          {/* Apply the custom style utility to each item */}
          <ToggleGroupItem value="all" aria-label="All platforms" className={toggleItemStyle(filters.platform === 'all')}>
            <Sparkles className="h-4 w-4 mr-2"/>All
          </ToggleGroupItem>
          <ToggleGroupItem value="telegram" aria-label="Telegram" className={toggleItemStyle(filters.platform === 'telegram')}>
            <FaTelegramPlane className="h-4 w-4 mr-2"/>Telegram
          </ToggleGroupItem>
          <ToggleGroupItem value="tiktok" aria-label="TikTok" className={toggleItemStyle(filters.platform === 'tiktok')}>
            <FaTiktok className="h-4 w-4 mr-2"/>TikTok
          </ToggleGroupItem>
          <ToggleGroupItem value="youtube" aria-label="YouTube" className={toggleItemStyle(filters.platform === 'youtube')}>
            <FaYoutube className="h-4 w-4 mr-2"/>YouTube
          </ToggleGroupItem>
        </ToggleGroup>
        
        {/* Sorting Dropdown - Using the new dark blue style */}
        <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={handleSortChange}>
          <SelectTrigger className={cn(selectTriggerStyle, "md:ml-auto")}>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent className="bg-sky-900 text-slate-200 border-sky-700">
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="members-desc">Members: High to Low</SelectItem>
            <SelectItem value="members-asc">Members: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Category and Other Options */}
      <div className="border-t border-sky-800 pt-4 flex flex-col md:flex-row md:items-center md:justify-start md:gap-x-8 gap-y-4">
        
        {/* Category Dropdown - Using the new dark blue style */}
        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger className={selectTriggerStyle}>
            <SelectValue placeholder="Filter by category..." />
          </SelectTrigger>
          <SelectContent className="bg-sky-900 text-slate-200 border-sky-700">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Checkbox for Including Sold Listings */}
        <div className="flex items-center space-x-2 md:ml-auto">
          <Checkbox 
            id="includeSold" 
            checked={filters.includeSold} 
            onCheckedChange={handleIncludeSoldChange}
            className={checkboxStyle} // Apply the custom checkbox style
          />
          <Label htmlFor="includeSold" className="text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors">
            Include Sold Listings
          </Label>
        </div>
        
      </div>
    </div>
  );
}