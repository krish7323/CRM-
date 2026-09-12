import mongoose, { Schema } from 'mongoose';

const DocumentSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    studentCode: { type: String, required: true },
    studentName: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        'Aadhaar / ID Proof',
        'Academic Transcript',
        'Passport / Visa',
        'Admission Agreement',
        'Birth Certificate',
        'Transfer Certificate',
        'Other',
      ],
    },
    name: { type: String, required: true },
    fileUrl: { type: String, default: '' },
    fileSize: { type: String, default: '1.5 MB' },
    mimeType: { type: String, default: 'application/pdf' },
    status: {
      type: String,
      enum: ['Pending', 'Submitted', 'Verified', 'Rejected'],
      default: 'Verified',
    },
    uploadedBy: { type: String, default: 'Staff' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

DocumentSchema.index({ studentId: 1, type: 1 });

export default mongoose.model('Document', DocumentSchema);
