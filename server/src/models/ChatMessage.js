import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema(
  {
    senderName: { type: String, required: true },
    senderRole: { type: String, required: true },
    recipientId: { type: String, required: true },
    chatType: { type: String, enum: ['Direct', 'Group'], default: 'Direct' },
    text: { type: String, required: true },
    attachments: [{ title: String, url: String }],
    readStatus: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ChatMessageSchema.index({ recipientId: 1, createdAt: -1 });
export default mongoose.model('ChatMessage', ChatMessageSchema);
