import mongoose, { Schema, Document } from 'mongoose';

export type MessageStatus = 'queued' | 'sent' | 'delivered' | 'read' | 'failed';

export interface IMessage extends Document {
  recipientPhone: string;
  recipientName: string;
  studentOrLeadId?: mongoose.Types.ObjectId;
  type: 'WhatsApp' | 'SMS' | 'Email';
  templateName: string;
  content: string;
  status: MessageStatus;
  sentAt: Date;
  metaMessageId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    recipientPhone: { type: String, required: true },
    recipientName: { type: String, required: true },
    studentOrLeadId: { type: Schema.Types.ObjectId },
    type: { type: String, enum: ['WhatsApp', 'SMS', 'Email'], default: 'WhatsApp' },
    templateName: { type: String, required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ['queued', 'sent', 'delivered', 'read', 'failed'],
      default: 'sent',
    },
    sentAt: { type: Date, default: Date.now },
    metaMessageId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>('Message', MessageSchema);
