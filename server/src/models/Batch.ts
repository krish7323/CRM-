import mongoose, { Schema, Document } from 'mongoose';

export type BatchStatus = 'Upcoming' | 'Ongoing' | 'Completed';

export interface IBatch extends Document {
  code: string; // e.g. GER-A1-B01
  courseId: mongoose.Types.ObjectId;
  courseName: string;
  level: string;
  teacherId?: mongoose.Types.ObjectId;
  teacherName?: string;
  room: string; // e.g. Room 101, Online Zoom A
  days: string[]; // ['Mon', 'Wed', 'Fri']
  timing: string; // '09:00 AM - 11:00 AM'
  startDate: Date;
  endDate: Date;
  maxStudents: number;
  currentEnrolledCount: number;
  status: BatchStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BatchSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    courseName: { type: String, required: true },
    level: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User' },
    teacherName: { type: String, default: 'Unassigned' },
    room: { type: String, required: true },
    days: [{ type: String, required: true }],
    timing: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    maxStudents: { type: Number, required: true, default: 20 },
    currentEnrolledCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed'],
      default: 'Ongoing',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBatch>('Batch', BatchSchema);
