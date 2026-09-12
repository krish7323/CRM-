import mongoose, { Schema } from 'mongoose';

const FollowUpSchema = new Schema({
  date: { type: Date, default: Date.now },
  outcome: {
    type: String,
    enum: ['interested', 'not interested', 'no response', 'call back later', 'demo scheduled', 'other'],
    required: true,
  },
  notes: { type: String, required: true },
  nextFollowUpDate: { type: Date, index: true },
  by: { type: String, required: true },
});

const StatusHistorySchema = new Schema({
  fromStatus: { type: String },
  toStatus: { type: String, required: true },
  changedBy: { type: String, required: true },
  changedAt: { type: Date, default: Date.now },
  reason: { type: String, default: '' },
});

const LeadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    parentName: { type: String, default: '' },
    aadhaarNo: { type: String, default: '' },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    city: { type: String, default: 'Kaithal' },
    course: { type: String, required: true },
    language: {
      type: String,
      default: 'German',
    },
    level: {
      type: String,
      default: 'A1',
    },
    source: { type: String, default: 'Walk-in' },
    quotedFee: { type: Number, required: true, default: 25000 },
    counsellorId: { type: Schema.Types.ObjectId, ref: 'User' },
    counsellorName: { type: String },
    status: {
      type: String,
      enum: ['new', 'contacted', 'interested', 'not_interested', 'converted', 'lost'],
      default: 'new',
      lowercase: true,
      index: true,
    },
    statusHistory: [StatusHistorySchema],
    followUps: [FollowUpSchema],
    nextFollowUpDate: { type: Date, index: true },
    convertedStudentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    createdBy: { type: String, default: 'System' },
    updatedBy: { type: String, default: 'System' },
  },
  { timestamps: true }
);

LeadSchema.index({ status: 1, nextFollowUpDate: 1 });

export default mongoose.model('Lead', LeadSchema);
