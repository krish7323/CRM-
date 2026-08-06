import mongoose from 'mongoose';

const ExamSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    examType: {
      type: String,
      enum: ['Unit Test', 'Monthly Test', 'Mid Term', 'Final Exam', 'Practical', 'Mock Test', 'Assessment'],
      default: 'Mid Term',
    },
    session: { type: String, default: '2026-27' },
    batchCode: { type: String, required: true },
    subject: { type: String, required: true },
    examDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    room: { type: String },
    invigilatorName: { type: String },
    totalMarks: { type: Number, default: 100 },
    passingMarks: { type: Number, default: 50 },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

ExamSchema.index({ batchCode: 1, examDate: 1 });
export default mongoose.model('Exam', ExamSchema);
