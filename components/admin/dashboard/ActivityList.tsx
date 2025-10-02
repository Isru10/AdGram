"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users } from 'lucide-react';

// Define the shape of the data we'll get from the API
type ListItem = {
  _id: string;
  title: string;
  price?: number;   // Optional property
  members?: number; // Optional property
  seller: { name: string, image?: string };
  category?: string;
};

type ActivityListProps = {
  title: "Recent Sales" | "Top Ads by Members";
};

export default function ActivityList({ title }: ActivityListProps) {
  const [items, setItems] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isSalesList = title === "Recent Sales";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/activity');
        const result = await res.json();
        setItems(isSalesList ? result.recentSales : result.topAds);
      } catch (error) {
        console.error("Failed to fetch activity list data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isSalesList]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {items.map(item => (
            <div key={item._id} className='flex items-center justify-between gap-4'>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm relative overflow-hidden">
                  <Image 
                    src={isSalesList ? (item.seller?.image ?? '/adgram_logo.png') : "/adgram_logo.png"} 
                    alt={item.title} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="flex flex-col">
                  <p className='text-sm font-medium text-white truncate max-w-[120px]'> 
                    {item.title}
                  </p>
                  <Badge variant="outline" className="w-fit mt-1">
                    {isSalesList ? item.seller.name : item.category}
                  </Badge>
                </div>
              </div>

              {/* --- FIX IS HERE --- */}
              <div className="text-sm font-semibold flex items-center">
                {isSalesList ? (
                  <>
                    <DollarSign className="h-4 w-4 mr-1 text-green-400" />
                    {/* Add a check: if item.price exists, render it */}
                    {item.price && <span className="text-white">${item.price.toLocaleString()}</span>}
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-1 text-blue-400" />
                    {/* Add a check: if item.members exists, render it */}
                    {item.members && <span className="text-white">{(item.members / 1000).toFixed(1)}K</span>}
                  </>
                )}
              </div>
              {/* --- END OF FIX --- */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}