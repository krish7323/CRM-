import mongoose, { Schema, Document } from 'mongoose';

export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer' | 'Card';
export type FeeStatus = 'Pending' | 'Partial' | 'Paid' | 'Overdue';

export interface IInstallment {
  installmentNo: number;
  amount: number;
  dueDate: Date;
  paidAmount: number;
  paidDate?: Date;
  mode?: PaymentMode;
  transactionRef?: string;
  receiptUrl?: string;
  status: 'Pending' | 'Paid' | 'Overdue';
}

export interface IFee extends Document {
  studentId: mongoose.Types.ObjectId;
  studentCode: string;
  studentName: string;
  courseName: string;
  totalFee: number;
  discount: number;
  netFee: number;
  paidTotal: number;
  remainingTotal: number;
  installments: IInstallment[];
  status: FeeStatus;
  createdAt: Date;
  updatedAt: Date;
}

const FeeSchema: Schema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    studentCode: { type: String, required: true },
    studentName: { type: String, required: true },
    courseName: { type: String, required: true },
    totalFee: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    netFee: { type: Number, required: true },
    paidTotal: { type: Number, default: 0 },
    remainingTotal: { type: Number, required: true },
    installments: [
      {
        installmentNo: { type: Number, required: true },
        amount: { type: Number, required: true },
        dueDate: { type: Date, required: true },
        paidAmount: { type: Number, default: 0 },
        paidDate: { type: Date },
        mode: { type: String, enum: ['Cash', 'UPI', 'Bank Transfer', 'Card'] },
        transactionRef: { type: String },
        receiptUrl: { type: String },
        status: { type: String, enum: ['Pending', 'Paid', 'Overdue'], default: 'Pending' },
      },
    ],
    status: {
      type: String,
      enum: ['Pending', 'Partial', 'Paid', 'Overdue'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IFee>('Fee', FeeSchema);
