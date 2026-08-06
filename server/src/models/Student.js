import mongoose, { Schema } from 'mongoose';
const StudentSchema = new Schema({
    studentId: { type: String, required: true, unique: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
    name: { type: String, required: true, trim: true },
    dob: { type: Date },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, default: '' },
    guardianName: { type: String },
    emergencyContact: { type: String },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    courseName: { type: String, required: true },
    level: { type: String, required: true },
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch' },
    batchCode: { type: String },
    joiningDate: { type: Date, default: Date.now },
    admissionDate: { type: Date, default: Date.now },
    documents: [
        {
            type: { type: String, required: true },
            url: { type: String, required: true },
            status: { type: String, enum: ['Pending', 'Submitted', 'Verified'], default: 'Submitted' },
        },
    ],
    referralSource: { type: String },
    isActive: { type: Boolean, default: true },
    photoUrl: { type: String },
}, { timestamps: true });
export default mongoose.model('Student', StudentSchema);
