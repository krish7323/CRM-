import mongoose from 'mongoose';

const LeaveRequestSchema = new mongoose.Schema(
  {
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicantName: { type: String, required: true },
    applicantRole: { type: String, required: true },
    leaveType: { type: String, enum: ['Casual', 'Medical', 'Emergency', 'Half Day'], default: 'Casual' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    substituteTeacher: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    approvedBy: { type: String },
    approvedDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LeaveRequestSchema.index({ applicantId: 1, status: 1 });
export default mongoose.model('LeaveRequest', LeaveRequestSchema);
