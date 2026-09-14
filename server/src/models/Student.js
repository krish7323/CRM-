import mongoose, { Schema } from 'mongoose';

const StudentSchema = new Schema(
  {
    studentId: { type: String, required: true, unique: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', index: true },
    enrollmentType: {
      type: String,
      enum: ['Path_A_CRM', 'Path_B_Direct'],
      default: 'Path_B_Direct',
    },
    name: { type: String, required: true, trim: true },
    dob: { type: Date },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, default: '' },
    aadhaarNo: { type: String, default: '' },
    fatherName: { type: String, default: '' },
    motherName: { type: String, default: '' },
    guardianName: { type: String, default: '' },
    parentPhone: { type: String, default: '' },
    parentWhatsapp: { type: String, default: '' },
    parentEmail: { type: String, default: '' },
    parentOccupation: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
    verificationStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Verified' },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    courseName: { type: String, required: true },
    level: { type: String, required: true },
    packageType: { type: String, default: 'Quarterly' },
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch', required: true, index: true },
    batchCode: { type: String, required: true, index: true },
    teacherName: { type: String, default: 'Unassigned' },
    joiningDate: { type: Date, default: Date.now },
    admissionDate: { type: Date, default: Date.now },
    timeline: [
      {
        title: { type: String, required: true },
        detail: { type: String },
        by: { type: String, default: 'System' },
        at: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Graduated', 'Dropped Out', 'Fee Defaulter', 'Inactive', 'Transferred', 'Suspended'],
      default: 'Active',
      index: true,
    },
    isArchived: { type: Boolean, default: false, index: true },
    statusHistory: [
      {
        fromStatus: { type: String },
        toStatus: { type: String, required: true },
        reason: { type: String },
        changedBy: { type: String, default: 'Director' },
        date: { type: Date, default: Date.now },
        finalScore: { type: Number },
        grade: { type: String },
        remarks: { type: String },
        certificateNo: { type: String },
      },
    ],
    graduationDetails: {
      graduatedAt: { type: Date },
      finalScore: { type: Number },
      grade: { type: String },
      certificateNo: { type: String },
      remarks: { type: String },
    },
    feePlan: { type: String, enum: ['Full', 'Installment'], default: 'Full' },
    totalFee: { type: Number, default: 25000 },
    discount: { type: Number, default: 0 },
    netFee: { type: Number, default: 25000 },
    paidFee: { type: Number, default: 0 },
    feeBalance: { type: Number, default: 25000 },
    feeDefaulterFlag: { type: Boolean, default: false },
    feeDefaulterReason: { type: String, default: '' },
    documents: [
      {
        docType: { type: String },
        name: { type: String },
        url: { type: String },
        fileSize: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    photoUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

StudentSchema.index({ name: 'text', studentId: 'text', batchCode: 'text', phone: 'text' });
StudentSchema.index({ status: 1, isArchived: 1 });

export default mongoose.model('Student', StudentSchema);
