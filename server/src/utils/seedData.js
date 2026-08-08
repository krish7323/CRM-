import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Lead from '../models/Lead.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Batch from '../models/Batch.js';
import Fee from '../models/Fee.js';
import Expense from '../models/Expense.js';
import Certificate from '../models/Certificate.js';
export const seedDatabase = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log('Database already initialized with seed data.');
            return;
        }
        console.log('Seeding initial The European Language Academy (TELA - Kaithal) data...');
        const defaultPassword = await bcrypt.hash('password123', 10);
        // Create Users for 6 roles
        const admin = await User.create({
            name: 'Dr. Rajesh Sharma (Principal/Owner)',
            email: 'admin@elh.edu',
            phone: '+91 98765 43210',
            passwordHash: defaultPassword,
            role: 'Owner/Admin',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        });
        const manager = await User.create({
            name: 'Sunita Verma',
            email: 'manager@elh.edu',
            phone: '+91 98123 45678',
            passwordHash: defaultPassword,
            role: 'Manager',
            avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        });
        const counsellor = await User.create({
            name: 'Priya Nair',
            email: 'counsellor@elh.edu',
            phone: '+91 99887 76655',
            passwordHash: defaultPassword,
            role: 'Counsellor',
            avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        });
        const teacher = await User.create({
            name: 'Prof. Amit Kulkarni',
            email: 'teacher@elh.edu',
            phone: '+91 97654 32109',
            passwordHash: defaultPassword,
            role: 'Teacher',
            avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
        });
        const accountant = await User.create({
            name: 'Suresh Patel',
            email: 'accountant@elh.edu',
            phone: '+91 98989 12345',
            passwordHash: defaultPassword,
            role: 'Accountant',
        });
        const studentUser = await User.create({
            name: 'Aarav Gupta',
            email: 'student@elh.edu',
            phone: '+91 91234 56789',
            passwordHash: defaultPassword,
            role: 'Student',
        });
        // Courses
        const germanCourse = await Course.create({
            name: 'German',
            code: 'GER',
            description: 'Comprehensive German language program following Goethe & CEFR guidelines.',
            levels: [
                { code: 'A1', durationWeeks: 8, totalClasses: 40, baseFee: 25000, syllabusOverview: 'Basics, Greetings, Daily Routine' },
                { code: 'A2', durationWeeks: 8, totalClasses: 40, baseFee: 28000, syllabusOverview: 'Grammatical cases, Work & Travel' },
                { code: 'B1', durationWeeks: 10, totalClasses: 50, baseFee: 35000, syllabusOverview: 'Complex sentences, Professional discussions' },
            ],
        });
        const frenchCourse = await Course.create({
            name: 'French',
            code: 'FRE',
            description: 'French language & DELF preparation.',
            levels: [
                { code: 'A1', durationWeeks: 8, totalClasses: 40, baseFee: 24000, syllabusOverview: 'Pronunciation, DELF A1 Prep' },
                { code: 'A2', durationWeeks: 8, totalClasses: 40, baseFee: 27000, syllabusOverview: 'DELF A2 Grammar' },
            ],
        });
        const hindiCourse = await Course.create({
            name: 'English & Public Speaking',
            code: 'ENG',
            description: 'Advanced Business English & Communication Skills.',
            levels: [
                { code: 'A1', durationWeeks: 8, totalClasses: 40, baseFee: 18000, syllabusOverview: 'Grammar & Vocabulary' },
                { code: 'B2', durationWeeks: 8, totalClasses: 40, baseFee: 22000, syllabusOverview: 'Fluency & Interview Mastery' },
            ],
        });
        // Batches
        const batchGermanA1 = await Batch.create({
            code: 'GER-A1-B01',
            courseId: germanCourse._id,
            courseName: 'German',
            level: 'A1',
            teacherId: teacher._id,
            teacherName: teacher.name,
            room: 'Aryabhata Hall (Room 102)',
            days: ['Mon', 'Wed', 'Fri'],
            timing: '09:00 AM - 11:00 AM',
            startDate: new Date('2026-07-01'),
            endDate: new Date('2026-08-25'),
            maxStudents: 20,
            currentEnrolledCount: 4,
            status: 'Ongoing',
        });
        // Leads
        await Lead.create([
            {
                name: 'Rohan Iyer',
                phone: '+91 98765 11111',
                whatsapp: '+91 98765 11111',
                email: 'rohan.i@example.com',
                city: 'Bengaluru',
                course: 'German',
                language: 'German',
                level: 'A1',
                source: 'Google Search',
                quotedFee: 25000,
                counsellorId: counsellor._id,
                counsellorName: counsellor.name,
                status: 'New',
                notes: [{ text: 'Inquired about morning intensive batch for MS in Germany', by: counsellor.name, at: new Date() }],
            },
            {
                name: 'Ananya Sharma',
                phone: '+91 98123 22222',
                whatsapp: '+91 98123 22222',
                email: 'ananya.s@example.com',
                city: 'New Delhi',
                course: 'French',
                language: 'French',
                level: 'A2',
                source: 'Instagram',
                quotedFee: 27000,
                counsellorId: counsellor._id,
                counsellorName: counsellor.name,
                status: 'Interested',
                nextFollowUpAt: new Date(Date.now() + 86400000),
                notes: [{ text: 'Interested in weekend online batch for DELF exam', by: counsellor.name, at: new Date() }],
            },
            {
                name: 'Kavya Nair',
                phone: '+91 99887 33333',
                whatsapp: '+91 99887 33333',
                email: 'kavya.n@example.com',
                city: 'Mumbai',
                course: 'Spanish',
                language: 'Spanish',
                level: 'A1',
                source: 'WhatsApp',
                quotedFee: 22000,
                counsellorId: counsellor._id,
                counsellorName: counsellor.name,
                status: 'Demo',
                nextFollowUpAt: new Date(),
                notes: [{ text: 'Attended demo session. Excellent feedback.', by: counsellor.name, at: new Date() }],
            },
        ]);
        // Student
        const student1 = await Student.create({
            studentId: 'IIA-1001',
            name: 'Aarav Gupta',
            phone: '+91 91234 56789',
            whatsapp: '+91 91234 56789',
            email: 'student@elh.edu',
            address: 'MG Road, Koramangala, Bengaluru',
            courseId: germanCourse._id,
            courseName: 'German',
            level: 'A1',
            batchId: batchGermanA1._id,
            batchCode: batchGermanA1.code,
            joiningDate: new Date('2026-07-01'),
            admissionDate: new Date('2026-07-01'),
            documents: [
                { type: 'Aadhaar Card', url: '/docs/aadhaar_aarav.pdf', status: 'Verified' },
                { type: 'Photo', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', status: 'Verified' },
            ],
            isActive: true,
        });
        // Fee
        await Fee.create({
            studentId: student1._id,
            studentCode: student1.studentId,
            studentName: student1.name,
            courseName: 'German A1',
            totalFee: 25000,
            discount: 2000,
            netFee: 23000,
            paidTotal: 15000,
            remainingTotal: 8000,
            installments: [
                {
                    installmentNo: 1,
                    amount: 15000,
                    dueDate: new Date('2026-07-01'),
                    paidAmount: 15000,
                    paidDate: new Date('2026-07-01'),
                    mode: 'UPI',
                    transactionRef: 'GPay-UPI-994182',
                    status: 'Paid',
                },
                {
                    installmentNo: 2,
                    amount: 8000,
                    dueDate: new Date(Date.now() + 5 * 86400000),
                    paidAmount: 0,
                    status: 'Pending',
                },
            ],
            status: 'Partial',
        });
        // Expense
        await Expense.create([
            { category: 'Rent', amount: 85000, date: new Date('2026-07-01'), paidBy: 'Dr. Rajesh Sharma', remarks: 'Main Campus Facility Rent (Bengaluru)' },
            { category: 'Salary', amount: 140000, date: new Date('2026-07-05'), paidBy: 'Sunita Verma', remarks: 'Faculty & Support Staff Salary' },
            { category: 'Marketing', amount: 25000, date: new Date('2026-07-10'), paidBy: 'Dr. Rajesh Sharma', remarks: 'Meta Ads & Google Ads' },
        ]);
        // Certificate
        await Certificate.create({
            certNumber: 'IIA-CERT-2026-1001',
            studentId: student1._id,
            studentName: student1.name,
            studentCode: student1.studentId,
            courseName: 'German Language & Culture',
            level: 'A1',
            grade: 'Distinction',
            scorePercentage: 94,
            issueDate: new Date('2026-07-28'),
            qrUrl: 'https://iia.edu.in/verify/IIA-CERT-2026-1001',
        });
        console.log('Indian International Academy (IIA) seed data inserted successfully!');
    }
    catch (error) {
        console.error('Error seeding database:', error);
    }
};
