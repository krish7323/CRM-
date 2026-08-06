import mongoose, { Schema } from 'mongoose';
const AttendanceSchema = new Schema({
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    batchCode: { type: String, required: true },
    date: { type: Date, required: true },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    records: [
        {
            studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
            studentName: { type: String, required: true },
            studentCode: { type: String, required: true },
            status: { type: String, enum: ['Present', 'Absent', 'Leave'], default: 'Present' },
            remarks: { type: String },
        },
    ],
}, { timestamps: true });
export default mongoose.model('Attendance', AttendanceSchema);
