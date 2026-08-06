import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['General', 'Teacher', 'Student', 'Parent', 'Counsellor', 'Accountant', 'Admin'], default: 'General' },
    priority: { type: String, enum: ['Normal', 'High', 'Urgent'], default: 'Normal' },
    targetRoles: [{ type: String }],
    isPinned: { type: Boolean, default: false },
    expiryDate: { type: Date },
    attachments: [{ title: String, url: String }],
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

NoticeSchema.index({ category: 1, isPinned: -1 });
export default mongoose.model('Notice', NoticeSchema);
