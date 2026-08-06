import mongoose, { Schema } from 'mongoose';
const CertificateSchema = new Schema({
    certNumber: { type: String, required: true, unique: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    studentName: { type: String, required: true },
    studentCode: { type: String, required: true },
    courseName: { type: String, required: true },
    level: { type: String, required: true },
    grade: { type: String, required: true, default: 'Pass' },
    scorePercentage: { type: Number, required: true, default: 85 },
    issueDate: { type: Date, default: Date.now },
    qrUrl: { type: String },
    pdfUrl: { type: String },
}, { timestamps: true });
export default mongoose.model('Certificate', CertificateSchema);
