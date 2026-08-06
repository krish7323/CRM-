import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    assetCode: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['Computers', 'Projectors', 'Furniture', 'Books', 'Lab Equipment', 'Sports Equipment', 'Printers', 'Network Devices'],
      default: 'Computers',
    },
    purchaseDate: { type: Date },
    purchasePrice: { type: Number },
    vendor: { type: String },
    status: { type: String, enum: ['Available', 'Issued', 'Repair', 'Scrapped'], default: 'Available' },
    assignedTo: { type: String },
    room: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

AssetSchema.index({ assetCode: 1, category: 1 });
export default mongoose.model('Asset', AssetSchema);
