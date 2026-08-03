import mongoose, { Schema, Document } from 'mongoose';

export type ExpenseCategory =
  | 'Rent'
  | 'Salary'
  | 'Electricity'
  | 'Internet'
  | 'Marketing'
  | 'Stationery'
  | 'Maintenance'
  | 'Other';

export interface IExpense extends Document {
  category: ExpenseCategory;
  amount: number;
  date: Date;
  paidBy: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    category: {
      type: String,
      enum: ['Rent', 'Salary', 'Electricity', 'Internet', 'Marketing', 'Stationery', 'Maintenance', 'Other'],
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    paidBy: { type: String, required: true },
    remarks: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
