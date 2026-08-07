import mongoose, { Schema } from 'mongoose';
const CourseSchema = new Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String },
    programType: { type: String, enum: ['School_K12', 'Language_Coaching', 'Custom_Skill'], default: 'Language_Coaching' },
    category: { type: String, enum: ['Pre-Primary', 'Primary', 'Middle', 'Secondary', 'Senior Secondary', 'Language_Coaching'], default: 'Language_Coaching' },
    levels: [
        {
            code: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], required: true },
            durationWeeks: { type: Number, required: true, default: 8 },
            totalClasses: { type: Number, required: true, default: 40 },
            baseFee: { type: Number, required: true, default: 15000 },
            syllabusOverview: { type: String },
        },
    ],
    sections: [
        {
            code: { type: String, required: true }, // 'Section A', 'Section B'
            teacherName: { type: String, default: 'Prof. Amit Kulkarni' },
            capacity: { type: Number, default: 35 },
            room: { type: String, default: 'Room 101' },
        },
    ],
    streams: [
        {
            name: { type: String, required: true }, // 'Science', 'Commerce', 'Arts/Humanities'
            subjects: [{ type: String }],
            fee: { type: Number, default: 35000 },
        },
    ],
    subjects: [
        {
            code: { type: String },
            name: { type: String, required: true },
            teacherName: { type: String },
            weeklyClasses: { type: Number, default: 5 },
            maxMarks: { type: Number, default: 100 },
            passingMarks: { type: Number, default: 33 },
        },
    ],
    packages: [
        {
            name: { type: String, required: true },
            fee: { type: Number, required: true },
            discountPercentage: { type: Number, default: 0 },
            durationMonths: { type: Number, default: 3 },
            studyMaterial: { type: String, default: 'Standard Workbook PDF & Portal Access' },
            booksIncluded: { type: Boolean, default: true },
            certificateIncluded: { type: Boolean, default: true },
        },
    ],
    studyMaterialOverview: { type: String, default: 'Official CEFR / CBSE Aligned Textbooks & Audio Modules' },
    assignedTeachers: [{ type: String }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.model('Course', CourseSchema);
