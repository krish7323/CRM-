import mongoose from 'mongoose';

const ExamMarkSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    studentCode: { type: String, required: true },
    studentName: { type: String, required: true },
    marksObtained: { type: Number, required: true },
    grade: { type: String },
    rank: { type: Number },
    teacherRemarks: { type: String },
    principalRemarks: { type: String },
    promotionStatus: { type: String, enum: ['Pass', 'Fail', 'Promoted'], default: 'Pass' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ExamMarkSchema.index({ examId: 1, studentId: 1 });
export default mongoose.model('ExamMark', ExamMarkSchema);
