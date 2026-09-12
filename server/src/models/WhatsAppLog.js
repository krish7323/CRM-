import mongoose, { Schema } from 'mongoose';

const WhatsAppLogSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    studentName: { type: String, required: true },
    recipientPhone: { type: String, required: true },
    templateType: {
      type: String,
      required: true,
      enum: ['FEE_OVERDUE_REMINDER', 'NOTICE_BROADCAST', 'EXAM_RESULT_PUBLISHED', 'PTM_SCHEDULED', 'ADMISSION_CONFIRMATION'],
    },
    referenceId: { type: String, required: true },
    dateStr: { type: String, required: true }, // Format: YYYY-MM-DD for daily idempotency
    payload: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: ['Sent', 'Delivered', 'Failed', 'Skipped_Idempotent'],
      default: 'Sent',
    },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Unique compound index ensures idempotency per student + template + reference per day
WhatsAppLogSchema.index({ studentId: 1, templateType: 1, referenceId: 1, dateStr: 1 }, { unique: true });

export default mongoose.model('WhatsAppLog', WhatsAppLogSchema);
