import type { Types, Document } from "mongoose"

export interface IUser extends Document {
  _id: Types.ObjectId
  email: string
  password?: string
  name: string
  emailVerified: boolean
  verificationToken?: string
  role: "user" | "admin" | "superadmin"
  provider?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface IAd extends Document {
  _id: Types.ObjectId
  title: string
  description: string
  type: "BUY" | "SELL"
  ownerId: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface IConversation extends Document {
  _id: Types.ObjectId
  adId: Types.ObjectId
  participants: Types.ObjectId[]
  lastMessage?: Types.ObjectId
  lastMessageAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface IMessage extends Document {
  _id: Types.ObjectId
  conversationId: Types.ObjectId
  senderId: Types.ObjectId
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface AdWithOwner extends Omit<IAd, "ownerId"> {
  ownerId: {
    _id: string
    name: string
    email: string
  }
}

export interface ConversationWithDetails extends Omit<IConversation, "adId" | "participants" | "lastMessage"> {
  adId: IAd
  participants: IUser[]
  lastMessage?: IMessage
}

export interface MessageWithSender extends Omit<IMessage, "senderId"> {
  senderId: IUser
}
