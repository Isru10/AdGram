// This type represents a clean, simple Sponsored Ad object for use in our frontend.
// Notice that `_id` is explicitly a `string`.
export type SponsoredAd = {
  _id: string;
  companyName: string;
  description: string;
  imageUrl: string;
  destinationUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};