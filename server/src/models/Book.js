import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true },
    publisher: { type: String },
    category: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    barcode: { type: String, required: true, unique: true },
    shelf: { type: String },
    rack: { type: String },
    language: { type: String, default: 'English' },
    edition: { type: String },
    purchaseDate: { type: Date },
    purchasePrice: { type: Number },
    vendor: { type: String },
    status: {
      type: String,
      enum: ['Available', 'Issued', 'Lost', 'Damaged', 'Reserved'],
      default: 'Available',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BookSchema.index({ barcode: 1, isbn: 1 });
export default mongoose.model('Book', BookSchema);
