"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SponsoredAdForm from "@/components/admin/sponsored-ads/SponsoredAdForm";
import type { SponsoredAd } from "@/types";

export default function ManageSponsoredAdsPage() {
  const [ads, setAds] = useState<SponsoredAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // We use useCallback to memoize the fetch function for stability
  const fetchAds = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sponsored-ads');
      if (res.ok) {
        const data = await res.json();
        setAds(data);
      }
    } catch (error) {
      console.error("Failed to fetch sponsored ads:", error);
    }
  }, []);

  // useEffect to handle the initial data fetch
  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      await fetchAds();
      setIsLoading(false);
    }
    initialFetch();
  }, [fetchAds]);

  // Calculate the number of active ads.
  // `useMemo` is used for performance, so this calculation only re-runs when the `ads` array changes.
  const activeAdsCount = useMemo(() => {
    return ads.filter(ad => ad.isActive).length;
  }, [ads]);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    fetchAds(); // Refresh the table data when the dialog closes
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Sponsored Ads</h1>
          <p className="text-muted-foreground">
            {/* Display the active count in the header for the admin */}
            You have {activeAdsCount} of 2 active ads.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Ad</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Sponsored Ad</DialogTitle>
              <DialogDescription>Fill out the details below. Click save when you are done.</DialogDescription>
            </DialogHeader>
            {/* Pass the active count to the form */}
            <SponsoredAdForm 
              onFinished={handleDialogClose} 
              activeAdsCount={activeAdsCount} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <p className="text-center p-10 text-slate-400">Loading ads...</p>
      ) : (
        // Pass the active count and the refresh function down to the columns
        <DataTable columns={columns({ refreshData: fetchAds, activeAdsCount })} data={ads} />
      )}
    </div>
  );
}