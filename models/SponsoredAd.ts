import mongoose, { Schema, Document, Model } from "mongoose";

// Define the TypeScript interface for our document
export interface ISponsoredAd extends Document {
  companyName: string;
  // --- NEW FIELD ---
  description: string; // The eye-catching phrase
  imageUrl: string;
  destinationUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose schema
const SponsoredAdSchema = new Schema<ISponsoredAd>(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required."],
      trim: true,
    },
    
    // --- NEW SCHEMA DEFINITION ---
    description: {
      type: String,
      required: [true, "A short description or phrase is required."],
      trim: true,
      maxlength: [100, "Description cannot be more than 100 characters."], // Good for keeping it brief
    },
    
    imageUrl: {
      type: String,
      required: [true, "An image URL is required."],
    },
    destinationUrl: {
      type: String,
      required: [true, "A destination URL is required."],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
export default (mongoose.models.SponsoredAd as Model<ISponsoredAd>) ||
  mongoose.model<ISponsoredAd>("SponsoredAd", SponsoredAdSchema);