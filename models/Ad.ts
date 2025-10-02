import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for TypeScript type safety
export interface IAd extends Document {
  title: string;
  description: string;
  price: number;
  seller: Types.ObjectId;
  
  members: number;
  openedIn: number;
  ad_type: 'channel' | 'group' | 'account'; // 'account' can be used for TikTok/YouTube
  category: string;
  link: string;
  
  // --- NEW FIELD FOR PLATFORM ---
  platform: 'telegram' | 'tiktok' | 'youtube';

  status: 'available' | 'sold';

  createdAt: Date;
  updatedAt: Date;
}

const AdSchema = new Schema<IAd>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: {
      type: Number,
      required: [true, 'Please provide the number of members/subscribers.'],
    },
    openedIn: {
      type: Number,
      required: [true, 'Please provide the year the account was opened.'],
    },
    ad_type: {
      type: String,
      // We can add 'account' for TikTok/YouTube which aren't channels/groups
      enum: ['channel', 'group', 'account'], 
      required: [true, 'Please specify the account type.'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category (e.g., Tech, E-commerce).'],
    },
    link: {
      type: String,
      required: [true, 'Please provide the link to the account.'],
    },
    
    // --- NEW SCHEMA DEFINITION FOR PLATFORM ---
    platform: {
      type: String,
      enum: ['telegram', 'tiktok', 'youtube'],
      required: [true, 'Please specify the platform.'],
      default: 'telegram', // Ensures existing ads are categorized as Telegram
    },
    
    status: {
      type: String,
      enum: ['available', 'sold'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

// Use the existing model if it's already been compiled, otherwise create it
export default (mongoose.models.Ad as Model<IAd>) ||
  mongoose.model<IAd>("Ad", AdSchema);