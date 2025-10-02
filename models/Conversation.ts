import { IConversation } from "@/types"
import mongoose, { Schema, type Model } from "mongoose"


const ConversationSchema = new Schema<IConversation>(
  {
    adId: { type: Schema.Types.ObjectId, ref: "Ad", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

ConversationSchema.index({ adId: 1, participants: 1 })

export default (mongoose.models.Conversation as Model<IConversation>) ||
  mongoose.model<IConversation>("Conversation", ConversationSchema)
