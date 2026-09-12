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
      enum: ['Active', 'Transferred', 'Graduated', 'Suspended'],
      default: 'Active',
    },
    photoUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

StudentSchema.index({ name: 'text', studentId: 'text', batchCode: 'text', phone: 'text' });

export default mongoose.model('Student', StudentSchema);
