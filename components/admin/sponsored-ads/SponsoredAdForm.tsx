/* eslint-disable @typescript-eslint/no-explicit-any */


"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { SponsoredAd } from "@/types"; // Switched to the clean frontend type

// Update the props to accept the active ad count
type SponsoredAdFormProps = {
  // Use the clean SponsoredAd type for `existingAd`
  existingAd?: SponsoredAd | null;
  onFinished: () => void;
  activeAdsCount: number; // The count of currently active ads
};

export default function SponsoredAdForm({ existingAd, onFinished, activeAdsCount }: SponsoredAdFormProps) {
  // State for form fields
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  
  // The initial state of the switch is now dependent on the active count.
  // If we are NOT editing an ad, the switch is on (`true`) only if activeAdsCount is less than 2.
  const [isActive, setIsActive] = useState(
    existingAd ? existingAd.isActive : activeAdsCount < 2
  );
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If we are editing, populate the form with existing data
  useEffect(() => {
    if (existingAd) {
      setCompanyName(existingAd.companyName);
      setDescription(existingAd.description);
      setDestinationUrl(existingAd.destinationUrl);
      setIsActive(existingAd.isActive);
    }
  }, [existingAd]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!imageFile && !existingAd) {
      toast.error("An image is required to create a new ad.");
      setIsLoading(false);
      return;
    }

    try {
      let imageUrl = existingAd?.imageUrl || "";

      // 1. If an image file is selected, upload it to Cloudinary
      if (imageFile) {
        const sigResponse = await fetch('/api/admin/upload-signature', { method: 'POST' });
        const { timestamp, signature } = await sigResponse.json();
        
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp);
        formData.append('folder', 'sponsored-ads');
        
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

        const uploadResponse = await fetch(cloudinaryUrl, {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(`Image upload failed: ${errorData.error.message}`);
        }
        
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.secure_url;
      }
      
      const adData = { companyName, description, destinationUrl, isActive, imageUrl };
      
      const apiEndpoint = existingAd
        ? `/api/admin/sponsored-ads/${existingAd._id}`
        : '/api/admin/sponsored-ads';
      
      const method = existingAd ? 'PUT' : 'POST';

      const res = await fetch(apiEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save the ad.");
      }

      toast.success(`Sponsored ad ${existingAd ? 'updated' : 'created'} successfully!`);
      onFinished();

    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Logic to disable the switch:
  // The switch should be disabled if we are creating a NEW ad and the limit is already reached.
  // It should NOT be disabled if we are editing an existing ACTIVE ad (to allow the admin to deactivate it).
  const isSwitchDisabled = !existingAd && activeAdsCount >= 2;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Description (Catchy Phrase)</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={100} />
      </div>
      <div>
        <Label htmlFor="destinationUrl">Destination URL</Label>
        <Input id="destinationUrl" type="url" value={destinationUrl} onChange={(e) => setDestinationUrl(e.target.value)} required placeholder="https://example.com" />
      </div>
      <div>
        <Label htmlFor="image">Ad Image</Label>
        <Input id="image" type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} accept="image/*" />
        {existingAd?.imageUrl && !imageFile && (
          <p className="text-xs text-muted-foreground mt-2">Current image is set. Upload a new file to replace it.</p>
        )}
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Switch 
          id="isActive" 
          checked={isActive} 
          onCheckedChange={setIsActive}
          disabled={isSwitchDisabled}
          aria-readonly={isSwitchDisabled}
        />
        <Label htmlFor="isActive" className={isSwitchDisabled ? "text-muted-foreground" : ""}>
          Ad is Active
        </Label>
      </div>
      {isSwitchDisabled && (
          <p className="text-xs text-yellow-500 -mt-2">The maximum of 2 active ads has been reached. This ad will be created as inactive.</p>
      )}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (existingAd ? 'Update Ad' : 'Create Ad')}
        </Button>
      </div>
    </form>
  );
}