import mongoose, { Schema } from 'mongoose';
const ExpenseSchema = new Schema({
    category: {
        type: String,
        enum: ['Rent', 'Salary', 'Electricity', 'Internet', 'Marketing', 'Stationery', 'Maintenance', 'Other'],
        required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    paidBy: { type: String, required: true },
    remarks: { type: String },
}, { timestamps: true });
export default mongoose.model('Expense', ExpenseSchema);
