/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
 
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Image from "next/image";
import type { SponsoredAd } from "@/types";

// Helper function to toggle the 'isActive' status via API
const handleToggleActive = async (adId: string, isActive: boolean, refreshData: () => void) => {
  try {
    const res = await fetch(`/api/admin/sponsored-ads/${adId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update status.");
    }
    toast.success(`Ad status updated successfully!`);
    refreshData();
  } catch (error: any) {
    toast.error(error.message);
  }
};

// Helper function to delete an ad via API
const handleDelete = async (adId: string, refreshData: () => void) => {
  if (!window.confirm("Are you sure you want to delete this ad?")) return;
  try {
    const res = await fetch(`/api/admin/sponsored-ads/${adId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("Failed to delete ad.");
    toast.success("Ad deleted successfully!");
    refreshData();
  } catch (error: any) {
    toast.error(error.message);
  }
};

// Define the shape of the props our columns function will receive
type ColumnProps = {
  refreshData: () => void;
  activeAdsCount: number;
};

// The columns function now accepts the props object
export const columns = ({ refreshData, activeAdsCount }: ColumnProps): ColumnDef<SponsoredAd>[] => [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => (
      <Image 
        src={row.getValue("imageUrl") as string} 
        alt={row.original.companyName} 
        width={40} 
        height={40} 
        className="rounded-md object-cover" 
      />
    )
  },
  {
    accessorKey: "companyName",
    header: "Company",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <p className="truncate max-w-[200px]">{row.getValue("description") as string}</p>
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const ad = row.original;
      
      // The switch should be disabled if:
      // 1. The ad is currently INACTIVE, AND
      // 2. The number of active ads is already 2 or more.
      const isSwitchDisabled = !ad.isActive && activeAdsCount >= 2;

      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={ad.isActive}
            onCheckedChange={() => handleToggleActive(ad._id, ad.isActive, refreshData)}
            disabled={isSwitchDisabled}
            aria-readonly={isSwitchDisabled}
          />
          <span className={isSwitchDisabled ? 'text-muted-foreground' : ''}>
            {ad.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ad = row.original;
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* We will add an "Edit" button here later */}
            <DropdownMenuItem 
              onClick={() => handleDelete(ad._id, refreshData)} 
              className="text-red-500 focus:bg-red-500/10 focus:text-red-500"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];