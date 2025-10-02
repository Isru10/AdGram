"use client";

import { type LucideIcon, TrendingUp } from "lucide-react"; // Import TrendingUp icon
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number; // Value can now be a string like "280 available"
  icon: LucideIcon;
  changeValue?: number; // Change value is now a number
  gradient: string;
};

export default function StatCard({ title, value, icon: Icon, changeValue, gradient }: StatCardProps) {
  return (
    <div className={cn("relative p-6 rounded-xl overflow-hidden text-white", gradient)}>
      {/* Aurora effect divs are unchanged */}
      <div className="absolute -top-1/2 -right-1/4 w-48 h-48 bg-white/20 rounded-full blur-2xl opacity-50"></div>
      <div className="absolute -bottom-1/2 -left-1/4 w-32 h-32 bg-white/20 rounded-full blur-2xl opacity-50"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium opacity-80">{title}</p>
          <Icon className="h-5 w-5 opacity-70" />
        </div>

        <div className="mt-2">
          <p className="text-4xl font-bold">
            {title.includes("Revenue") && "$"}
            {/* Check if value is a number before using toLocaleString */}
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        
        <div className="flex-grow"></div>
        
        {/* --- NEW DYNAMIC CHANGE TEXT LOGIC --- */}
        {/* Render this only if changeValue is a number and is not zero */}
        {typeof changeValue === 'number' && changeValue > 0 && (
          <div className="flex items-center gap-1 text-xs opacity-80 mt-4">
            <TrendingUp className="h-4 w-4 text-white/80" />
            <span>+{changeValue.toLocaleString()} since last week</span>
          </div>
        )}
      </div>
    </div>
  );
}