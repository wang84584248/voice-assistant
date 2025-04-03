import mongoose, { Schema, Document } from 'mongoose';
import { Types } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  _id: Types.ObjectId;
  userId: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, required: true, enum: ['user', 'assistant', 'system'] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ConversationSchema = new Schema<IConversation>(
  {
    userId: { type: String, required: true },
    messages: [MessageSchema]
  },
  { timestamps: true }
);

export default mongoose.models.Conversation || 
  mongoose.model<IConversation>('Conversation', ConversationSchema); 