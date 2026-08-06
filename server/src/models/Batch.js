import mongoose, { Schema } from 'mongoose';
const BatchSchema = new Schema({
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
}, { timestamps: true });
export default mongoose.model('Batch', BatchSchema);
