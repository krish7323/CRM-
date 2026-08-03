import mongoose, { Schema, Document } from 'mongoose';

export interface ILevelItem {
  code: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  durationWeeks: number;
  totalClasses: number;
  baseFee: number;
  syllabusOverview?: string;
}

export interface ICourse extends Document {
  name: string; // German, French, Spanish, Italian, Portuguese, English
  code: string; // GER, FRE, SPA, ITA, POR, ENG
  description?: string;
  levels: ILevelItem[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String },
    levels: [
      {
        code: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], required: true },
        durationWeeks: { type: Number, required: true, default: 8 },
        totalClasses: { type: Number, required: true, default: 40 },
        baseFee: { type: Number, required: true, default: 15000 },
        syllabusOverview: { type: String },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICourse>('Course', CourseSchema);
