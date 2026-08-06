import mongoose, { Schema } from 'mongoose';
const MessageSchema = new Schema({
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
}, { timestamps: true });
export default mongoose.model('Message', MessageSchema);
