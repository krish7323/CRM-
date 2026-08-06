import mongoose from 'mongoose';

const BookIssueSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    bookTitle: { type: String, required: true },
    barcode: { type: String, required: true },
    borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    borrowerName: { type: String, required: true },
    borrowerRole: { type: String, enum: ['Student', 'Teacher', 'Staff'], default: 'Student' },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    fineAmount: { type: Number, default: 0 },
    fineStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
    renewCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BookIssueSchema.index({ borrowerId: 1, bookId: 1 });
export default mongoose.model('BookIssue', BookIssueSchema);
