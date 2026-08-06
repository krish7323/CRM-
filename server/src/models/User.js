import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: [
        'Owner',
        'Admin',
        'Counsellor',
        'Teacher',
        'Accountant',
        'Librarian',
        'Transport Manager',
        'HR',
        'Parent',
        'Student',
        'Owner/Admin',
        'Manager',
      ],
      default: 'Counsellor',
    },
    customRoleTitle: { type: String },
    designation: { type: String },
    salaryAmount: { type: Number },
    commissionPercentage: { type: Number },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
