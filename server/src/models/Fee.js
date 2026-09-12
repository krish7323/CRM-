import mongoose, { Schema } from 'mongoose';

const InstallmentSchema = new Schema({
  installmentNo: { type: Number, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paidAmount: { type: Number, default: 0 },
  paidDate: { type: Date },
  mode: { type: String, enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card'] },
  receiptNumber: { type: String, index: true },
  transactionRef: { type: String },
  receiptUrl: { type: String },
  status: { type: String, enum: ['Pending', 'Partial', 'Paid', 'Overdue'], default: 'Pending' },
  collectedBy: { type: String },
});

const FeeSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    studentCode: { type: String, required: true },
    studentName: { type: String, required: true },
    courseName: { type: String, required: true },
    totalFee: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    netFee: { type: Number, required: true },
    paidTotal: { type: Number, default: 0 },
    remainingTotal: { type: Number, required: true },
    installments: [InstallmentSchema],
    status: {
      type: String,
      enum: ['Pending', 'Partial', 'Paid', 'Overdue'],
      default: 'Pending',
      index: true,
    },
    internalNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

FeeSchema.methods.recalculateStatus = function () {
  const paid = (this.installments || []).reduce((sum, i) => sum + (i.paidAmount || 0), 0);
  this.paidTotal = paid;
  this.remainingTotal = Math.max(0, this.netFee - paid);
  if (this.remainingTotal <= 0) {
    this.status = 'Paid';
  } else if (paid > 0) {
    this.status = 'Partial';
  } else {
    this.status = 'Pending';
  }
};

export default mongoose.model('Fee', FeeSchema);
