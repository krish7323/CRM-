import mongoose, { Schema } from 'mongoose';
const LeadSchema = new Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    city: { type: String, default: 'Online' },
    course: { type: String, required: true },
    language: {
        type: String,
        enum: ['German', 'French', 'Spanish', 'Italian', 'Portuguese', 'English'],
        default: 'German',
    },
    level: {
        type: String,
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        default: 'A1',
    },
    source: { type: String, default: 'Walk-in' },
    quotedFee: { type: Number, required: true, default: 0 },
    counsellorId: { type: Schema.Types.ObjectId, ref: 'User' },
    counsellorName: { type: String },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Interested', 'Demo', 'Follow-up', 'Admission', 'Lost'],
        default: 'New',
    },
    notes: [
        {
            text: { type: String, required: true },
            by: { type: String, required: true },
            at: { type: Date, default: Date.now },
        },
    ],
    nextFollowUpAt: { type: Date },
    lastConversation: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
export default mongoose.model('Lead', LeadSchema);
