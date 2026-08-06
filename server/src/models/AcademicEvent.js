import mongoose from 'mongoose';

const AcademicEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    eventType: {
      type: String,
      enum: [
        'School Holiday',
        'Exam Date',
        'PTM',
        'Annual Function',
        'Sports Day',
        'Class Event',
        'Seminar',
        'Competition',
        'Workshop',
        'Teacher Meeting',
        'Birthday',
        'Custom Event',
      ],
      default: 'Class Event',
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String },
    targetRoles: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

AcademicEventSchema.index({ startDate: 1, eventType: 1 });
export default mongoose.model('AcademicEvent', AcademicEventSchema);
