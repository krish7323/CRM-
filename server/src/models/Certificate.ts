import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  certNumber: string; // e.g. ELH-CERT-2026-8841
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  studentCode: string;
  courseName: string;
  level: string;
  grade: string; // Distinction, Merit, Pass
  scorePercentage: number;
  issueDate: Date;
  qrUrl?: string;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true }
);

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);
