import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'Owner/Admin' | 'Manager' | 'Counsellor' | 'Teacher' | 'Accountant' | 'Student';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['Owner/Admin', 'Manager', 'Counsellor', 'Teacher', 'Accountant', 'Student'],
      default: 'Counsellor',
    },
    isActive: { type: Boolean, default: true },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
