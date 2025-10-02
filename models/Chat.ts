import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IChat extends Document {
  ad: Types.ObjectId; // Reference to the Ad this chat is about
  buyer: Types.ObjectId; // Reference to the User who started the chat
  seller: Types.ObjectId; // Reference to the User who owns the ad
  unreadByBuyer: number;
  unreadBySeller: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    ad: {
      type: Schema.Types.ObjectId,
      ref: "Ad",
      required: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    unreadByBuyer: { type: Number, default: 0 },
    unreadBySeller: { type: Number, default: 0 },

  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.Chat as Model<IChat>) ||
  mongoose.model<IChat>("Chat", ChatSchema);