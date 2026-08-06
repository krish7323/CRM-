import mongoose from 'mongoose';

const HomeworkSubmissionSchema = new mongoose.Schema(
  {
    homeworkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Homework', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    studentCode: { type: String },
    studentName: { type: String, required: true },
    submissionDate: { type: Date, default: Date.now },
    fileUrl: { type: String, required: true },
    status: { type: String, enum: ['Submitted', 'Late', 'Evaluated'], default: 'Submitted' },
    marksObtained: { type: Number, default: 0 },
    teacherRemarks: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

HomeworkSubmissionSchema.index({ homeworkId: 1, studentId: 1 });
export default mongoose.model('HomeworkSubmission', HomeworkSubmissionSchema);
