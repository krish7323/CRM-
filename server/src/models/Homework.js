import mongoose from 'mongoose';

const HomeworkAttachmentSchema = new mongoose.Schema({
  type: { type: String, enum: ['PDF', 'Video', 'Image', 'Drive', 'YouTube'], required: true },
  url: { type: String, required: true },
  title: { type: String },
});

const HomeworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    batchCode: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    teacherName: { type: String },
    dueDate: { type: Date, required: true },
    totalMarks: { type: Number, default: 50 },
    attachments: [HomeworkAttachmentSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

HomeworkSchema.index({ batchCode: 1, dueDate: 1 });
export default mongoose.model('Homework', HomeworkSchema);
