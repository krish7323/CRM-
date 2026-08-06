import mongoose from 'mongoose';

const ScholarshipSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    studentCode: { type: String, required: true },
    studentName: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'Scholarship',
        'Fee Concession',
        'Sibling Discount',
        'Employee Discount',
        'Special Discount',
        'Referral Discount',
        'Early Bird Discount',
        'Custom Discount',
      ],
      required: true,
    },
    percentage: { type: Number, default: 0 },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['Requested', 'Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    approvedBy: { type: String },
    approvedDate: { type: Date },
    documents: [{ title: String, url: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ScholarshipSchema.index({ studentId: 1, status: 1 });
export default mongoose.model('Scholarship', ScholarshipSchema);
