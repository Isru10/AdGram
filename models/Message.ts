import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMessage extends Document {
  chat: Types.ObjectId; // Which chat this message belongs to
  sender: Types.ObjectId; // Which user sent this message
  content: string; // The actual text of the message
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.Message as Model<IMessage>) ||
  mongoose.model<IMessage>("Message", MessageSchema);