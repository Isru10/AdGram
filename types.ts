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



// --- Reusable Types for the Chat System ---

// 1. The type for the sender object
export type Sender = {
  _id: string;
  name: string;
  image?: string;
  // We should also include the user's email if needed, but we'll stick to what the component uses
};

// 2. The type for a single message that includes the sender's full details (populated)
export type MessageWithSender = {
  _id: string;
  content: string;
  // NOTE: This property should be named 'sender' based on the API route logic
  sender: Sender; 
  // NOTE: The previous code was using `message.senderId._id`, so let's keep that in mind
  // However, for clean component use, let's assume the correct property is `sender` and fix the component below.
  createdAt: string; // The Date as a string
};

// --- Add this property to fix the error in the ChatInterface component ---
export type Message = MessageWithSender;
