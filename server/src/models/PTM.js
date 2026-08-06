import mongoose from 'mongoose';

const PTMSchema = new mongoose.Schema(
  {
    teacherName: { type: String, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    studentCode: { type: String, required: true },
    studentName: { type: String, required: true },
    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
    meetingDate: { type: Date, required: true },
    meetingTime: { type: String, required: true },
    durationMinutes: { type: Number, default: 30 },
    meetingType: { type: String, enum: ['Classroom', 'Online'], default: 'Online' },
    meetLink: { type: String },
    notes: { type: String },
    actionItems: { type: String },
    status: { type: String, enum: ['Upcoming', 'Completed', 'Cancelled'], default: 'Upcoming' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PTMSchema.index({ meetingDate: 1, studentId: 1 });
export default mongoose.model('PTM', PTMSchema);
