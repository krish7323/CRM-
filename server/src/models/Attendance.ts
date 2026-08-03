import mongoose, { Schema, Document } from 'mongoose';

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave';

export interface IAttendanceRecord {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  studentCode: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface IAttendance extends Document {
  batchId: mongoose.Types.ObjectId;
  batchCode: string;
  date: Date;
  markedBy?: mongoose.Types.ObjectId;
  records: IAttendanceRecord[];
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true }
);

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
