import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  content: string;
  isUserMessage: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    isUserMessage: { type: Boolean, required: true, default: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema); 