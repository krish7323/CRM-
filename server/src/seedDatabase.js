import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Models
import User from './models/User.js';
import Lead from './models/Lead.js';
import Student from './models/Student.js';
import Course from './models/Course.js';
import Batch from './models/Batch.js';
import Attendance from './models/Attendance.js';
import Fee from './models/Fee.js';
import Expense from './models/Expense.js';
import Certificate from './models/Certificate.js';
import Book from './models/Book.js';
import BookIssue from './models/BookIssue.js';
import Homework from './models/Homework.js';
import HomeworkSubmission from './models/HomeworkSubmission.js';
import Scholarship from './models/Scholarship.js';
import PTM from './models/PTM.js';
import Exam from './models/Exam.js';
import ExamMark from './models/ExamMark.js';
import AcademicEvent from './models/AcademicEvent.js';
import TransportRoute from './models/TransportRoute.js';
import Vehicle from './models/Vehicle.js';
import Asset from './models/Asset.js';
import Notice from './models/Notice.js';
import LeaveRequest from './models/LeaveRequest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vizdigitalofficial_db_user:awvCYzaRT343kYNh@crm00.zhkkkuu.mongodb.net/iia_institute_erp?retryWrites=true&w=majority&appName=crm00';

const indianFirstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharva', 'Advait', 'Pranav', 'Adhiraj', 'Kabir', 'Ananya', 'Diya', 'Riya', 'Aadhya',
  'Pari', 'Anika', 'Isha', 'Avani', 'Myra', 'Kavya', 'Anvi', 'Navya', 'Trisha', 'Saanvi',
  'Rohan', 'Karan', 'Dev', 'Manish', 'Siddharth', 'Nikhil', 'Gaurav', 'Vikram', 'Alok', 'Yash',
  'Pooja', 'Neha', 'Sneha', 'Swati', 'Megha', 'Divya', 'Shreya', 'Priti', 'Anjali', 'Deepika',
  'Rahul', 'Varun', 'Tarun', 'Harsh', 'Mohit', 'Sameer', 'Rajesh', 'Suresh', 'Deepak', 'Manoj',
  'Kiran', 'Bhavna', 'Komal', 'Sangeeta', 'Sunita', 'Rekha', 'Anita', 'Rashmi', 'Smita', 'Archana',
  'Kunal', 'Abhinav', 'Shubham', 'Mayank', 'Rishabh', 'Shivam', 'Ayush', 'Utkarsh', 'Chirag', 'Tushar'
];

const indianLastNames = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Joshi', 'Mehta', 'Nair', 'Reddy',
  'Rao', 'Bhat', 'Deshmukh', 'Kulkarni', 'Roy', 'Sen', 'Das', 'Banerjee', 'Chowdhury', 'Dutta',
  'Agarwal', 'Bansal', 'Goyal', 'Mittak', 'Shah', 'Trivedi', 'Pandey', 'Mishra', 'Shukla', 'Tiwari'
];

const occupations = [
  'Software Engineer', 'Senior Business Analyst', 'Chartered Accountant', 'Civil Architect',
  'Government Officer', 'Professor & Educator', 'Medical Specialist Doctor', 'Entrepreneur',
  'Operations Manager', 'Financial Advisor', 'Senior Advocate', 'Executive Director'
];

const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-'];

export const seedDatabase = async () => {
  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    console.log('Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Lead.deleteMany({}),
      Student.deleteMany({}),
      Course.deleteMany({}),
      Batch.deleteMany({}),
      Attendance.deleteMany({}),
      Fee.deleteMany({}),
      Expense.deleteMany({}),
      Certificate.deleteMany({}),
      Book.deleteMany({}),
      BookIssue.deleteMany({}),
      Homework.deleteMany({}),
      HomeworkSubmission.deleteMany({}),
      Scholarship.deleteMany({}),
      PTM.deleteMany({}),
      Exam.deleteMany({}),
      ExamMark.deleteMany({}),
      AcademicEvent.deleteMany({}),
      TransportRoute.deleteMany({}),
      Vehicle.deleteMany({}),
      Asset.deleteMany({}),
      Notice.deleteMany({}),
      LeaveRequest.deleteMany({})
    ]);

    const ownerPasswordHash = await bcrypt.hash('Owner@123', 10);
    const counsellorPasswordHash = await bcrypt.hash('Counsellor@123', 10);
    const teacherPasswordHash = await bcrypt.hash('Teacher@123', 10);
    const studentPasswordHash = await bcrypt.hash('Student@123', 10);
    const parentPasswordHash = await bcrypt.hash('Parent@123', 10);

    // 1. Create Core Users
    console.log('Seeding Core Operational Users (Owner, Counsellors, Teachers)...');
    const ownerUser = await User.create({
      name: 'Amit Sharma',
      email: 'owner@schoolerp.com',
      phone: '+91 98110 11223',
      passwordHash: ownerPasswordHash,
      role: 'Owner',
      designation: 'Founder & Chairman',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    });

    const counsellors = await User.insertMany([
      {
        name: 'Priya Verma',
        email: 'priya@schoolerp.com',
        phone: '+91 99887 76655',
        passwordHash: counsellorPasswordHash,
        role: 'Counsellor',
        customRoleTitle: 'Senior Admissions Counsellor',
        commissionPercentage: 5,
        isActive: true,
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      },
      {
        name: 'Rahul Singh',
        email: 'rahul@schoolerp.com',
        phone: '+91 99887 76644',
        passwordHash: counsellorPasswordHash,
        role: 'Counsellor',
        customRoleTitle: 'Admissions Counsellor',
        commissionPercentage: 4,
        isActive: true,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      }
    ]);

    const teacherDefs = [
      { name: 'Anita Sharma', email: 'teacher1@schoolerp.com', subject: 'Mathematics' },
      { name: 'Vikas Kumar', email: 'teacher2@schoolerp.com', subject: 'Science' },
      { name: 'Sneha Gupta', email: 'teacher3@schoolerp.com', subject: 'English' },
      { name: 'Rohit Sharma', email: 'teacher4@schoolerp.com', subject: 'Computer Science' },
      { name: 'Neha Verma', email: 'teacher5@schoolerp.com', subject: 'Social Science' },
    ];

    const teachers = await User.insertMany(
      teacherDefs.map((t, idx) => ({
        name: t.name,
        email: t.email,
        phone: `+91 97654 3210${idx}`,
        passwordHash: teacherPasswordHash,
        role: 'Teacher',
        customRoleTitle: `Head of ${t.subject} Faculty`,
        salaryAmount: 65000 + idx * 2500,
        isActive: true,
        avatarUrl: `https://images.unsplash.com/photo-${1560250097 + idx}-0b93528c311a?w=150`,
      }))
    );

    // 2. Create Courses / Programs
    console.log('Seeding Academic Programs & Classes...');
    const programDefs = [
      { name: 'Nursery', code: 'NUR', category: 'Pre-Primary', baseFee: 20000 },
      { name: 'LKG', code: 'LKG', category: 'Pre-Primary', baseFee: 22000 },
      { name: 'UKG', code: 'UKG', category: 'Pre-Primary', baseFee: 24000 },
      { name: 'Class 1', code: 'STD-01', category: 'Primary', baseFee: 28000 },
      { name: 'Class 2', code: 'STD-02', category: 'Primary', baseFee: 30000 },
      { name: 'Class 3', code: 'STD-03', category: 'Primary', baseFee: 32000 },
      { name: 'Class 4', code: 'STD-04', category: 'Primary', baseFee: 34000 },
      { name: 'Class 5', code: 'STD-05', category: 'Primary', baseFee: 36000 },
      { name: 'Class 6', code: 'STD-06', category: 'Middle', baseFee: 38000 },
      { name: 'Class 7', code: 'STD-07', category: 'Middle', baseFee: 40000 },
      { name: 'Class 8', code: 'STD-08', category: 'Middle', baseFee: 42000 },
      { name: 'Class 9', code: 'STD-09', category: 'Secondary', baseFee: 45000 },
      { name: 'Class 10', code: 'STD-10', category: 'Secondary', baseFee: 48000 },
      { name: 'Class 11 Science', code: 'STD-11-SCI', category: 'Senior Secondary', baseFee: 55000 },
      { name: 'Class 11 Commerce', code: 'STD-11-COM', category: 'Senior Secondary', baseFee: 50000 },
      { name: 'Class 11 Arts', code: 'STD-11-ART', category: 'Senior Secondary', baseFee: 48000 },
      { name: 'Class 12 Science', code: 'STD-12-SCI', category: 'Senior Secondary', baseFee: 60000 },
      { name: 'Class 12 Commerce', code: 'STD-12-COM', category: 'Senior Secondary', baseFee: 54000 },
      { name: 'Class 12 Arts', code: 'STD-12-ART', category: 'Senior Secondary', baseFee: 50000 },
      { name: 'JEE Coaching', code: 'JEE-PROGRAM', category: 'Coaching', baseFee: 75000 },
      { name: 'NEET Coaching', code: 'NEET-PROGRAM', category: 'Coaching', baseFee: 75000 },
      { name: 'SSC Coaching', code: 'SSC-PROGRAM', category: 'Coaching', baseFee: 35000 },
      { name: 'Banking Coaching', code: 'BNK-PROGRAM', category: 'Coaching', baseFee: 32000 }
    ];

    const courses = await Course.insertMany(
      programDefs.map((p) => ({
        name: p.name,
        code: p.code,
        description: `Official ${p.name} Academic Curriculum & Learning Track`,
        programType: p.category === 'Coaching' ? 'Custom_Skill' : 'School_K12',
        category: p.category === 'Coaching' ? 'Language_Coaching' : p.category,
        levels: [{ code: 'A1', baseFee: p.baseFee, durationWeeks: 40, totalClasses: 200 }],
        packages: [
          { name: 'Monthly', fee: Math.round(p.baseFee / 10), discountPercentage: 0 },
          { name: 'Quarterly', fee: Math.round((p.baseFee / 4) * 0.95), discountPercentage: 5 },
          { name: 'Yearly', fee: Math.round(p.baseFee * 0.85), discountPercentage: 15 }
        ],
        isActive: true
      }))
    );

    // 3. Create Batches
    console.log('Seeding Batches...');
    const batchDefs = [
      { code: 'Class 1 A', courseName: 'Class 1', teacherName: 'Anita Sharma', room: 'Room 101' },
      { code: 'Class 1 B', courseName: 'Class 1', teacherName: 'Vikas Kumar', room: 'Room 102' },
      { code: 'Class 2 A', courseName: 'Class 2', teacherName: 'Sneha Gupta', room: 'Room 103' },
      { code: 'Class 3 A', courseName: 'Class 3', teacherName: 'Rohit Sharma', room: 'Room 104' },
      { code: 'Class 4 A', courseName: 'Class 4', teacherName: 'Neha Verma', room: 'Room 105' },
      { code: 'Class 5 A', courseName: 'Class 5', teacherName: 'Anita Sharma', room: 'Room 106' },
      { code: 'Class 6 A', courseName: 'Class 6', teacherName: 'Vikas Kumar', room: 'Room 107' },
      { code: 'Class 7 A', courseName: 'Class 7', teacherName: 'Sneha Gupta', room: 'Room 108' },
      { code: 'Class 8 A', courseName: 'Class 8', teacherName: 'Rohit Sharma', room: 'Room 109' },
      { code: 'Class 9 A', courseName: 'Class 9', teacherName: 'Neha Verma', room: 'Room 110' },
      { code: 'Class 10 A', courseName: 'Class 10', teacherName: 'Anita Sharma', room: 'Room 111' },
      { code: 'Class 11 Science A', courseName: 'Class 11 Science', teacherName: 'Vikas Kumar', room: 'Lab 201' },
      { code: 'Class 11 Commerce A', courseName: 'Class 11 Commerce', teacherName: 'Sneha Gupta', room: 'Room 202' },
      { code: 'Class 12 Science A', courseName: 'Class 12 Science', teacherName: 'Rohit Sharma', room: 'Lab 203' },
      { code: 'JEE Morning', courseName: 'JEE Coaching', teacherName: 'Anita Sharma', room: 'Aryabhata Hall' },
      { code: 'JEE Evening', courseName: 'JEE Coaching', teacherName: 'Vikas Kumar', room: 'Aryabhata Hall' },
      { code: 'NEET Morning', courseName: 'NEET Coaching', teacherName: 'Sneha Gupta', room: 'Charaka Hall' },
      { code: 'SSC Weekend', courseName: 'SSC Coaching', teacherName: 'Neha Verma', room: 'Ramanujan Hall' }
    ];

    const batches = await Batch.insertMany(
      batchDefs.map((b, idx) => {
        const matchedCourse = courses.find((c) => c.name === b.courseName) || courses[idx % courses.length];
        const matchedTeacher = teachers.find((t) => t.name === b.teacherName) || teachers[idx % teachers.length];
        return {
          code: b.code,
          courseId: matchedCourse._id,
          courseName: b.courseName,
          level: 'Standard',
          teacherId: matchedTeacher._id,
          teacherName: b.teacherName,
          room: b.room,
          timing: '09:00 AM - 02:00 PM',
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          maxStudents: 40,
          currentEnrolledCount: 4,
          status: 'Ongoing',
          startDate: new Date('2026-04-01'),
          endDate: new Date('2027-03-31')
        };
      })
    );

    // 4. Generate 80 Students & 80 Parents
    console.log('Generating 80 Students & 80 Parents with full profile linkage...');
    const studentsToInsert = [];
    const parentUsersToInsert = [];
    const studentUsersToInsert = [];

    for (let i = 1; i <= 80; i++) {
      const fn = indianFirstNames[i % indianFirstNames.length];
      const ln = indianLastNames[i % indianLastNames.length];
      const studentName = `${fn} ${ln}`;
      const fatherName = `Rajesh ${ln}`;
      const motherName = `Sunita ${ln}`;
      const parentEmail = `parent${i}@schoolerp.com`;
      const studentEmail = `student${i}@schoolerp.com`;
      const studentCode = `STU-${1000 + i}`;
      const admissionNo = `ADM-2026-${String(i).padStart(3, '0')}`;

      const course = courses[i % courses.length];
      const batch = batches[i % batches.length];
      const teacher = teachers[i % teachers.length];
      const counsellor = counsellors[i % counsellors.length];

      const verificationStatus = i <= 70 ? 'Verified' : i <= 76 ? 'Pending' : 'Rejected';
      const gender = i % 2 === 0 ? 'Male' : 'Female';
      const dobYear = 2008 + (i % 10);

      // Parent user account
      parentUsersToInsert.push({
        name: `${fatherName} (Parent of ${studentName})`,
        email: parentEmail,
        phone: `+91 98${1000000 + i}`,
        passwordHash: parentPasswordHash,
        role: 'Parent',
        isActive: true,
        avatarUrl: `https://images.unsplash.com/photo-${1472099645785 + (i % 10)}?w=150`,
      });

      // Student user account
      studentUsersToInsert.push({
        name: studentName,
        email: studentEmail,
        phone: `+91 91${2000000 + i}`,
        passwordHash: studentPasswordHash,
        role: 'Student',
        isActive: true,
        avatarUrl: `https://images.unsplash.com/photo-${1539571696357 + (i % 10)}?w=150`,
      });

      // Student domain profile
      studentsToInsert.push({
        studentId: studentCode,
        name: studentName,
        dob: new Date(`${dobYear}-05-${(i % 25) + 1}`),
        phone: `+91 91${2000000 + i}`,
        whatsapp: `+91 91${2000000 + i}`,
        email: studentEmail,
        address: `${100 + i}, Sector ${(i % 15) + 1}, Central City, India`,
        fatherName: fatherName,
        motherName: motherName,
        guardianName: fatherName,
        parentPhone: `+91 98${1000000 + i}`,
        parentWhatsapp: `+91 98${1000000 + i}`,
        parentEmail: parentEmail,
        parentOccupation: occupations[i % occupations.length],
        emergencyContact: `+91 98${1000000 + i}`,
        verificationStatus: verificationStatus,
        courseId: course._id,
        courseName: course.name,
        level: course.name,
        packageType: i % 3 === 0 ? 'Yearly' : i % 2 === 0 ? 'Quarterly' : 'Monthly',
        batchId: batch._id,
        batchCode: batch.code,
        teacherName: teacher.name,
        admissionDate: new Date(`2026-04-${(i % 20) + 1}`),
        joiningDate: new Date(`2026-04-${(i % 20) + 1}`),
        photoUrl: `https://images.unsplash.com/photo-${1539571696357 + (i % 10)}?w=150`,
        timeline: [
          { title: 'Student Registered', detail: `Registered by Counsellor ${counsellor.name}`, by: counsellor.name, at: new Date(`2026-04-${(i % 20) + 1}`) },
          { title: 'Verification Completed', detail: `Status set to ${verificationStatus}`, by: 'Amit Sharma', at: new Date('2026-04-22') }
        ],
        isActive: true
      });
    }

    await User.insertMany([...parentUsersToInsert, ...studentUsersToInsert]);
    const createdStudents = await Student.insertMany(studentsToInsert);
    console.log(`Created ${createdStudents.length} Students & Parent accounts.`);

    // 5. Generate Fee Records & Receipts
    console.log('Seeding Fee Schedules & Receipts...');
    const feesToInsert = [];
    createdStudents.forEach((std, idx) => {
      const netFee = 30000 + (idx % 10) * 3000;
      const status = idx % 4 === 0 ? 'Paid' : idx % 3 === 0 ? 'Partial' : 'Pending';
      const paidTotal = status === 'Paid' ? netFee : status === 'Partial' ? Math.round(netFee * 0.5) : 0;
      const remainingTotal = netFee - paidTotal;

      feesToInsert.push({
        studentId: std._id,
        studentCode: std.studentId,
        studentName: std.name,
        courseName: std.courseName,
        totalFee: netFee + 3000,
        discount: 3000,
        netFee: netFee,
        paidTotal: paidTotal,
        remainingTotal: remainingTotal,
        status: status === 'Paid' ? 'Paid' : remainingTotal === 0 ? 'Paid' : 'Pending',
        installments: [
          {
            installmentNo: 1,
            amount: Math.round(netFee / 2),
            dueDate: new Date('2026-04-10'),
            status: paidTotal >= Math.round(netFee / 2) ? 'Paid' : 'Pending',
            paidAmount: paidTotal >= Math.round(netFee / 2) ? Math.round(netFee / 2) : 0,
            paidDate: new Date('2026-04-05'),
            mode: 'UPI',
            transactionRef: `GPay-UPI-${80000 + idx}`
          },
          {
            installmentNo: 2,
            amount: Math.round(netFee / 2),
            dueDate: new Date('2026-08-10'),
            status: paidTotal === netFee ? 'Paid' : 'Pending',
            paidAmount: paidTotal === netFee ? Math.round(netFee / 2) : 0,
            paidDate: new Date('2026-08-01'),
            mode: 'Bank Transfer',
            transactionRef: `NFT-BANK-${90000 + idx}`
          }
        ]
      });
    });
    await Fee.insertMany(feesToInsert);

    // 6. Generate 60 Days Attendance Records
    console.log('Generating 60 Days Attendance Records...');
    const attendanceLogsToInsert = [];
    const today = new Date();
    for (let dayOffset = 0; dayOffset < 60; dayOffset++) {
      const d = new Date(today);
      d.setDate(d.getDate() - dayOffset);
      if (d.getDay() === 0) continue;

      const dateStr = d.toISOString().split('T')[0];
      batches.forEach((b) => {
        const batchStudents = createdStudents.filter((s) => s.batchCode === b.code);
        if (batchStudents.length > 0) {
          attendanceLogsToInsert.push({
            batchId: b._id,
            batchCode: b.code,
            date: d,
            records: batchStudents.map((s, sIdx) => ({
              studentId: s._id,
              studentCode: s.studentId,
              studentName: s.name,
              status: (sIdx + dayOffset) % 15 === 0 ? 'Absent' : (sIdx + dayOffset) % 20 === 0 ? 'Leave' : 'Present'
            }))
          });
        }
      });
    }
    await Attendance.insertMany(attendanceLogsToInsert.slice(0, 150));

    // 7. Homework & Assignments
    console.log('Seeding Homework & Submissions...');
    const homeworksToInsert = teachers.map((t, idx) => ({
      title: `${t.customRoleTitle?.split(' ')[2] || 'Core'} Practice Assignment #${idx + 1}`,
      batchCode: batches[idx % batches.length].code,
      teacherId: t._id,
      teacherName: t.name,
      description: 'Solve problem set 1 to 15 from Chapter 3 textbook and submit PDF scan.',
      dueDate: new Date(Date.now() + (idx + 2) * 86400000),
      totalMarks: 100
    }));
    const createdHomeworks = await Homework.insertMany(homeworksToInsert);

    const submissionsToInsert = [];
    createdStudents.slice(0, 40).forEach((std, sIdx) => {
      const hw = createdHomeworks[sIdx % createdHomeworks.length];
      submissionsToInsert.push({
        homeworkId: hw._id,
        studentId: std._id,
        studentCode: std.studentId,
        studentName: std.name,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        submissionDate: new Date(),
        marksObtained: 75 + (sIdx % 23),
        teacherRemarks: 'Excellent syntax formation and structured step solutions.',
        status: 'Evaluated'
      });
    });
    await HomeworkSubmission.insertMany(submissionsToInsert);

    // 8. Exams, Marks & Report Cards
    console.log('Seeding Exams & Report Cards...');
    const examDefs = [
      { title: 'Unit Test 1 - Term 1', examType: 'Unit Test', subject: 'Mathematics' },
      { title: 'Mid-Term Examinations 2026', examType: 'Mid Term', subject: 'Science & Physics' },
      { title: 'Final Board Test Series', examType: 'Final Exam', subject: 'Computer Science' }
    ];
    const createdExams = await Exam.insertMany(
      examDefs.map((ex, idx) => ({
        title: ex.title,
        examType: ex.examType,
        batchCode: batches[idx % batches.length].code,
        subject: ex.subject,
        examDate: new Date(Date.now() + (idx + 5) * 86400000),
        startTime: '09:00 AM',
        room: 'Aryabhata Hall (Room 102)',
        invigilatorName: teachers[idx % teachers.length].name,
        totalMarks: 100,
        passingMarks: 33
      }))
    );

    const examMarksToInsert = [];
    createdStudents.forEach((std, sIdx) => {
      const ex = createdExams[sIdx % createdExams.length];
      const marks = 45 + (sIdx % 52);
      examMarksToInsert.push({
        examId: ex._id,
        studentId: std._id,
        studentCode: std.studentId,
        studentName: std.name,
        marksObtained: marks,
        grade: marks >= 90 ? 'A+' : marks >= 75 ? 'A' : marks >= 60 ? 'B+' : marks >= 50 ? 'B' : 'C',
        rank: (sIdx % 10) + 1,
        teacherRemarks: 'Strong conceptual clarity shown in final response section.',
        approvalStatus: 'Published',
        publishedBy: 'Amit Sharma'
      });
    });
    await ExamMark.insertMany(examMarksToInsert);

    // 9. Leave Requests
    console.log('Seeding Leave Requests...');
    const leaveRequestsToInsert = [
      {
        applicantId: teachers[0]._id,
        applicantName: teachers[0].name,
        applicantRole: 'Teacher',
        leaveType: 'Casual',
        startDate: new Date('2026-08-15'),
        endDate: new Date('2026-08-16'),
        reason: 'Attending educational symposium in New Delhi',
        substituteTeacher: teachers[1].name,
        status: 'Approved'
      },
      {
        applicantId: teachers[2]._id,
        applicantName: teachers[2].name,
        applicantRole: 'Teacher',
        leaveType: 'Medical',
        startDate: new Date('2026-08-20'),
        endDate: new Date('2026-08-22'),
        reason: 'Viral fever rest advised by physician',
        substituteTeacher: teachers[3].name,
        status: 'Pending'
      },
      {
        applicantId: ownerUser._id,
        applicantName: createdStudents[0].name,
        applicantRole: 'Student',
        leaveType: 'Emergency',
        startDate: new Date('2026-08-18'),
        endDate: new Date('2026-08-19'),
        reason: 'Sister wedding ceremony in hometown',
        substituteTeacher: 'N/A',
        status: 'Approved'
      }
    ];
    await LeaveRequest.insertMany(leaveRequestsToInsert);

    // 10. Library (200 Books)
    console.log('Seeding Library (200 Books)...');
    const bookTitles = [
      'NCERT Mathematics Class 10', 'Concepts of Physics by HC Verma Vol 1', 'Organic Chemistry Part 1',
      'Fundamentals of Computer Science with Python', 'History of Ancient & Medieval India',
      'Indian Economy by Ramesh Singh', 'Higher Algebra by Hall & Knight', 'Oxford English Grammar Guide',
      'CEFR German A1 Netzwerk Kursbuch', 'DELF French B1 Preparation Guide'
    ];
    const booksToInsert = [];
    for (let b = 1; b <= 200; b++) {
      const title = `${bookTitles[b % bookTitles.length]} - Edition ${2020 + (b % 5)}`;
      booksToInsert.push({
        title: title,
        author: `Author ${b}`,
        isbn: `978-3-16-1484${String(b).padStart(3, '0')}-0`,
        barcode: `IIA-BK-${1000 + b}`,
        category: b % 3 === 0 ? 'Science' : b % 2 === 0 ? 'Mathematics' : 'General Literature',
        totalCopies: 5,
        availableCopies: 4,
        shelfLocation: `Rack ${(b % 10) + 1}-Shelf B`,
        status: 'Available'
      });
    }
    const createdBooks = await Book.insertMany(booksToInsert);

    const issuesToInsert = createdStudents.slice(0, 20).map((std, iIdx) => ({
      bookId: createdBooks[iIdx]._id,
      bookTitle: createdBooks[iIdx].title,
      barcode: createdBooks[iIdx].barcode,
      borrowerId: ownerUser._id,
      borrowerName: std.name,
      borrowerRole: 'Student',
      issueDate: new Date('2026-08-01'),
      dueDate: new Date('2026-08-15')
    }));
    await BookIssue.insertMany(issuesToInsert);

    // 11. Transport (5 Routes & 3 Buses)
    console.log('Seeding Transport Fleet & Routes...');
    const routesToInsert = [
      { routeCode: 'R-101', routeName: 'Indiranagar - Mg Road - Campus', driverName: 'Sardar Singh', driverPhone: '+91 94455 66701', feePerTerm: 4500, pickupTime: '07:30 AM' },
      { routeCode: 'R-102', routeName: 'Koramangala - HSR Layout - Campus', driverName: 'Ramesh Kumar', driverPhone: '+91 94455 66702', feePerTerm: 4800, pickupTime: '07:20 AM' },
      { routeCode: 'R-103', routeName: 'Whitefield - ITPL Main Road - Campus', driverName: 'Prakash Patil', driverPhone: '+91 94455 66703', feePerTerm: 5200, pickupTime: '07:10 AM' },
      { routeCode: 'R-104', routeName: 'Electronic City - Bannerghatta - Campus', driverName: 'Suresh Gowda', driverPhone: '+91 94455 66704', feePerTerm: 5500, pickupTime: '07:00 AM' },
      { routeCode: 'R-105', routeName: 'Hebbal - Yelahanka - Campus', driverName: 'Manjunath B', driverPhone: '+91 94455 66705', feePerTerm: 5000, pickupTime: '07:15 AM' }
    ];
    await TransportRoute.insertMany(routesToInsert);

    const vehiclesToInsert = [
      { vehicleNumber: 'KA-01-EA-1001', busModel: 'Tata Starbus 40 Seater', capacity: 40, driverName: 'Sardar Singh', status: 'Active' },
      { vehicleNumber: 'KA-01-EA-1002', busModel: 'Eicher Skyline Pro 45 Seater', capacity: 45, driverName: 'Ramesh Kumar', status: 'Active' },
      { vehicleNumber: 'KA-01-EA-1003', busModel: 'Ashok Leyland Sunshine 50 Seater', capacity: 50, driverName: 'Prakash Patil', status: 'Active' }
    ];
    await Vehicle.insertMany(vehiclesToInsert);

    // 12. Inventory & Assets
    console.log('Seeding Inventory & Infrastructure Assets...');
    const assetsToInsert = [
      { name: 'Dell OptiPlex 7090 Desktop (Computer Lab 1)', assetCode: 'IIA-AST-1001', category: 'IT Electronics', room: 'Computer Lab 101', purchaseDate: '2025-06-15', cost: 55000, status: 'Available' },
      { name: 'Epson EB-E01 Classroom Projector', assetCode: 'IIA-AST-2001', category: 'Audio Visual', room: 'Aryabhata Hall', purchaseDate: '2025-08-20', cost: 38000, status: 'Available' },
      { name: 'Dual Student Classroom Bench & Desk Set', assetCode: 'IIA-AST-3001', category: 'Furniture', room: 'Room 102', purchaseDate: '2025-04-10', cost: 12000, status: 'Available' },
      { name: 'Advanced Chemistry Practical Glassware Kit', assetCode: 'IIA-AST-4001', category: 'Lab Equipment', room: 'Chemistry Lab', purchaseDate: '2025-11-05', cost: 25000, status: 'Available' }
    ];
    await Asset.insertMany(assetsToInsert);

    // 13. PTM Meetings
    console.log('Seeding Parent Teacher Meetings...');
    const ptmsToInsert = createdStudents.slice(0, 15).map((std, pIdx) => ({
      studentId: std._id,
      studentCode: std.studentId,
      studentName: std.name,
      parentName: std.fatherName,
      parentPhone: std.parentPhone,
      teacherName: std.teacherName,
      meetingDate: new Date('2026-08-25'),
      meetingTime: '10:30 AM',
      meetLink: 'https://meet.google.com/iia-parent-teacher-conf',
      notes: 'Term 1 Academic Progress Review & Performance Evaluation',
      status: pIdx % 2 === 0 ? 'Upcoming' : 'Completed'
    }));
    await PTM.insertMany(ptmsToInsert);

    // 14. Notices & Announcements
    console.log('Seeding Notices & Announcements...');
    const noticesToInsert = [
      {
        title: 'CBSE Mid-Term Examination Schedule Announcement',
        content: 'Official timetable for Class 9 to Class 12 Mid-Term tests has been published in the portal.',
        category: 'General',
        priority: 'High',
        isPinned: true
      },
      {
        title: 'Parent Teacher Conference Reminder',
        content: 'All parents are requested to join the virtual PTM scheduled for August 25 via Google Meet.',
        category: 'PTM',
        priority: 'High',
        isPinned: true
      },
      {
        title: 'Teacher Academic Staff Meeting',
        content: 'Mandatory faculty briefing in Aryabhata Hall at 03:30 PM this Friday.',
        category: 'Staff',
        priority: 'Medium',
        isPinned: false
      }
    ];
    await Notice.insertMany(noticesToInsert);

    console.log('\n=========================================================');
    console.log('SUCCESSFULLY SEEDED DATABASE WITH COMPLETE REALISTIC DEMO DATA');
    console.log('=========================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('DATABASE SEEDING FAILED:', err);
    process.exit(1);
  }
};

if (process.argv[1] && process.argv[1].includes('seedDatabase')) {
  seedDatabase();
}
