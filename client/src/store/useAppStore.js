import { create } from 'zustand';
import { canManageUser, getCreatableRoles, ROLE_RANKS } from '../utils/hierarchy.js';

// Initial Registered Operational Users Roster
const initialRegisteredUsers = [
  {
    id: 'usr-owner',
    name: 'Amit Sharma (Institute Owner)',
    email: 'owner@elh.edu',
    phone: '+91 98110 11223',
    password: 'Owner@123',
    role: 'Owner',
    designation: 'Founder & Managing Director',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'usr-counsellor-1',
    name: 'Priya Verma',
    email: 'priya@elh.edu',
    phone: '+91 99887 76655',
    password: 'Counsellor@123',
    role: 'Counsellor',
    customRoleTitle: 'Senior Admissions Counsellor',
    commissionPercentage: 5,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  },
  {
    id: 'usr-counsellor-2',
    name: 'Rahul Singh',
    email: 'rahul@elh.edu',
    phone: '+91 99887 76644',
    password: 'Counsellor@123',
    role: 'Counsellor',
    customRoleTitle: 'Language Admissions Counsellor',
    commissionPercentage: 4,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'usr-teacher-1',
    name: 'Anita Sharma',
    email: 'anita@elh.edu',
    phone: '+91 97654 32101',
    password: 'Teacher@123',
    role: 'Teacher',
    customRoleTitle: 'Head of German Faculty',
    salaryAmount: 65000,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
  },
  {
    id: 'usr-teacher-2',
    name: 'Vikas Kumar',
    email: 'vikas@elh.edu',
    phone: '+91 97654 32102',
    password: 'Teacher@123',
    role: 'Teacher',
    customRoleTitle: 'Head of French Faculty',
    salaryAmount: 67500,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'usr-teacher-3',
    name: 'Sneha Gupta',
    email: 'sneha@elh.edu',
    phone: '+91 97654 32103',
    password: 'Teacher@123',
    role: 'Teacher',
    customRoleTitle: 'Head of Spanish Faculty',
    salaryAmount: 70000,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
  {
    id: 'usr-teacher-4',
    name: 'Rohit Sharma',
    email: 'rohit@elh.edu',
    phone: '+91 97654 32104',
    password: 'Teacher@123',
    role: 'Teacher',
    customRoleTitle: 'Head of English & Communication',
    salaryAmount: 72500,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  },
];

const initialCustomRoles = [
  { id: 'role-c1', name: 'Head Admissions Counsellor', parentRole: 'Counsellor', rank: 2, description: 'Senior counsellor', createdBy: 'Amit Sharma' },
];

const initialLeads = [
  {
    _id: 'ld-1',
    name: 'Rohan Verma',
    parentName: 'Sanjay Verma',
    aadhaarNo: '4532-8901-2345',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: 'rohan.verma@gmail.com',
    city: 'Bengaluru',
    course: 'German Language (A1)',
    language: 'German',
    level: 'A1',
    quotedFee: 25000,
    source: 'Walk-in',
    status: 'Contacted',
    notes: [{ text: 'Expressed interest in weekend Goethe A1 batch', by: 'Priya Verma', at: new Date().toISOString() }],
    callHistory: [{ durationSeconds: 180, notes: 'Discussed schedule & Goethe A1 syllabus', outcome: 'Interested', date: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'ld-2',
    name: 'Ananya Sharma',
    parentName: 'Rajesh Sharma',
    aadhaarNo: '7890-1234-5678',
    phone: '+91 99887 76655',
    whatsapp: '+91 99887 76655',
    email: 'ananya.s@gmail.com',
    city: 'Bengaluru',
    course: 'French Language (A1)',
    language: 'French',
    level: 'A1',
    quotedFee: 28000,
    source: 'Google Ads',
    status: 'Interested',
    notes: [{ text: 'Requested demo class for DELF A1 French', by: 'Priya Verma', at: new Date().toISOString() }],
    callHistory: [],
    createdAt: new Date().toISOString(),
  },
];

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
  'Agarwal', 'Bansal', 'Goyal', 'Mittal', 'Shah', 'Trivedi', 'Pandey', 'Mishra', 'Shukla', 'Tiwari'
];

const occupations = [
  'Software Engineer', 'Senior Business Analyst', 'Chartered Accountant', 'Civil Architect',
  'Government Officer', 'Professor & Educator', 'Medical Specialist Doctor', 'Entrepreneur',
  'Operations Manager', 'Financial Advisor', 'Senior Advocate', 'Executive Director'
];

const programList = [
  'German Language (A1)',
  'German Language (A2)',
  'German Language (B1)',
  'German Language (B2)',
  'French Language (A1)',
  'French Language (A2)',
  'French Language (B1)',
  'Spanish Language (A1)',
  'Spanish Language (A2)',
  'Italian Language (A1)',
  'English & Business Communication'
];

const initialBatches = [
  { _id: 'btc-1', code: 'GER-A1-B01', courseName: 'German Language (A1)', level: 'A1', teacherName: 'Anita Sharma', room: 'Berlin Hall', timing: '08:00 AM - 10:00 AM', days: ['Mon', 'Wed', 'Fri'], maxStudents: 25, currentStudents: 18, status: 'Ongoing', startDate: '2026-04-01' },
  { _id: 'btc-2', code: 'GER-A2-B01', courseName: 'German Language (A2)', level: 'A2', teacherName: 'Anita Sharma', room: 'Munich Room', timing: '10:30 AM - 12:30 PM', days: ['Tue', 'Thu', 'Sat'], maxStudents: 25, currentStudents: 15, status: 'Ongoing', startDate: '2026-04-01' },
  { _id: 'btc-3', code: 'FRE-A1-B01', courseName: 'French Language (A1)', level: 'A1', teacherName: 'Vikas Kumar', room: 'Paris Hall', timing: '09:00 AM - 11:00 AM', days: ['Mon', 'Wed', 'Fri'], maxStudents: 25, currentStudents: 16, status: 'Ongoing', startDate: '2026-04-01' },
  { _id: 'btc-4', code: 'SPA-A1-B01', courseName: 'Spanish Language (A1)', level: 'A1', teacherName: 'Sneha Gupta', room: 'Madrid Room', timing: '02:00 PM - 04:00 PM', days: ['Tue', 'Thu', 'Sat'], maxStudents: 25, currentStudents: 12, status: 'Ongoing', startDate: '2026-04-01' },
  { _id: 'btc-5', code: 'ENG-C1-B01', courseName: 'English & Business Communication', level: 'C1', teacherName: 'Rohit Sharma', room: 'London Studio', timing: '06:00 PM - 08:00 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], maxStudents: 30, currentStudents: 22, status: 'Ongoing', startDate: '2026-04-01' }
];

const teacherNames = ['Anita Sharma', 'Vikas Kumar', 'Sneha Gupta', 'Rohit Sharma'];
const counsellorNames = ['Priya Verma', 'Rahul Singh'];

const generate80Students = () => {
  const students = [];
  for (let i = 1; i <= 80; i++) {
    const fn = indianFirstNames[i % indianFirstNames.length];
    const ln = indianLastNames[i % indianLastNames.length];
    const sName = `${fn} ${ln}`;
    const fName = `Rajesh ${ln}`;
    const mName = `Sunita ${ln}`;
    const code = `ELH-${1000 + i}`;
    const pType = programList[i % programList.length];
    const bCode = initialBatches[i % initialBatches.length].code;
    const tName = teacherNames[i % teacherNames.length];
    const cName = counsellorNames[i % counsellorNames.length];
    const status = i <= 70 ? 'Verified' : i <= 76 ? 'Pending' : 'Rejected';

    students.push({
      _id: `std-${i}`,
      studentId: code,
      admissionNo: `ADM-ELH-${String(i).padStart(3, '0')}`,
      rollNo: String((i % 30) + 1),
      name: sName,
      dob: `2004-05-${(i % 25) + 1}`,
      gender: i % 2 === 0 ? 'Male' : 'Female',
      bloodGroup: ['A+', 'B+', 'O+', 'AB+'][i % 4],
      phone: `+91 91${2000000 + i}`,
      email: `student${i}@elh.edu`,
      address: `${100 + i}, Sector ${(i % 15) + 1}, Central City, India`,
      fatherName: fName,
      motherName: mName,
      guardianName: fName,
      parentPhone: `+91 98${1000000 + i}`,
      parentWhatsapp: `+91 98${1000000 + i}`,
      parentEmail: `parent${i}@elh.edu`,
      parentOccupation: occupations[i % occupations.length],
      emergencyContact: `+91 98${1000000 + i}`,
      verificationStatus: status,
      courseName: pType,
      level: pType.includes('A1') ? 'A1' : pType.includes('A2') ? 'A2' : pType.includes('B1') ? 'B1' : 'C1',
      packageType: i % 3 === 0 ? 'Standard' : i % 2 === 0 ? 'Intensive' : 'Weekend',
      batchCode: bCode,
      teacherName: tName,
      counsellorName: cName,
      joiningDate: `2026-04-${(i % 20) + 1}`,
      admissionDate: `2026-04-${(i % 20) + 1}`,
      photoUrl: `https://images.unsplash.com/photo-${1539571696357 + (i % 10)}?w=150`,
      isActive: true,
      timeline: [
        { title: 'Student Enrolled', detail: `Enrolled by Counsellor ${cName}`, by: cName, at: `2026-04-${(i % 20) + 1}` },
        { title: 'Document Verification', detail: `Status: ${status}`, by: 'Amit Sharma', at: '2026-04-22' }
      ]
    });
  }
  return students;
};

const initialStudents = generate80Students();

const initialSubjects = [
  { _id: 'sb-1', code: 'GER-VOC-101', name: 'German A1 Grammar & Speaking', teacherName: 'Anita Sharma', weeklyClasses: 5, maxMarks: 100, passingMarks: 33, isPractical: true },
  { _id: 'sb-2', code: 'FRE-DELF-101', name: 'DELF French Phonetics & Listening', teacherName: 'Vikas Kumar', weeklyClasses: 4, maxMarks: 100, passingMarks: 33, isPractical: true },
  { _id: 'sb-3', code: 'SPA-DELE-101', name: 'DELE Spanish Conversation & Writing', teacherName: 'Sneha Gupta', weeklyClasses: 4, maxMarks: 100, passingMarks: 33, isPractical: true },
  { _id: 'sb-4', code: 'ENG-BIZ-501', name: 'Business English & Public Speaking', teacherName: 'Rohit Sharma', weeklyClasses: 5, maxMarks: 100, passingMarks: 33, isPractical: true }
];

const initialAcademicYears = [
  { _id: 'ay-1', code: '2026-27', name: 'ELH Academic Session 2026-2027', startDate: '2026-04-01', endDate: '2027-03-31', isCurrent: true, status: 'Active' }
];

const initialSchoolClasses = [];

const initialCourses = [
  { _id: 'crs-1', code: 'GER-A1', name: 'German A1 Beginner', language: 'German', levelCode: 'A1', durationMonths: 3, baseFee: 25000, description: 'Goethe-Zertifikat A1 Preparation' },
  { _id: 'crs-2', code: 'GER-A2', name: 'German A2 Elementary', language: 'German', levelCode: 'A2', durationMonths: 3, baseFee: 28000, description: 'Goethe-Zertifikat A2 Preparation' },
  { _id: 'crs-3', code: 'GER-B1', name: 'German B1 Intermediate', language: 'German', levelCode: 'B1', durationMonths: 4, baseFee: 35000, description: 'Goethe-Zertifikat B1 Work & Study' },
  { _id: 'crs-4', code: 'FRE-A1', name: 'French A1 Beginner', language: 'French', levelCode: 'A1', durationMonths: 3, baseFee: 25000, description: 'DELF A1 Examination Preparation' },
  { _id: 'crs-5', code: 'FRE-A2', name: 'French A2 Elementary', language: 'French', levelCode: 'A2', durationMonths: 3, baseFee: 28000, description: 'DELF A2 Examination Preparation' },
  { _id: 'crs-6', code: 'SPA-A1', name: 'Spanish A1 Beginner', language: 'Spanish', levelCode: 'A1', durationMonths: 3, baseFee: 24000, description: 'DELE A1 Certification Preparation' },
  { _id: 'crs-7', code: 'ENG-PRO', name: 'English & Business Speaking', language: 'English', levelCode: 'C1', durationMonths: 2, baseFee: 20000, description: 'Professional Fluency & Corporate Accent' }
];

const generate80Fees = (students) => {
  return students.map((std, idx) => {
    const netFee = 30000 + (idx % 10) * 3000;
    const status = idx % 4 === 0 ? 'Paid' : idx % 3 === 0 ? 'Partial' : 'Pending';
    const paidTotal = status === 'Paid' ? netFee : status === 'Partial' ? Math.round(netFee * 0.5) : 0;
    const remainingTotal = netFee - paidTotal;
    return {
      _id: `fee-${idx + 1}`,
      studentId: std._id,
      studentCode: std.studentId,
      studentName: std.name,
      courseName: std.courseName,
      totalFee: netFee + 3000,
      discount: 3000,
      netFee: netFee,
      paidTotal: paidTotal,
      remainingTotal: remainingTotal,
      status: status,
      installments: [
        { installmentNo: 1, amount: Math.round(netFee / 2), paidAmount: paidTotal >= Math.round(netFee / 2) ? Math.round(netFee / 2) : paidTotal, status: paidTotal >= Math.round(netFee / 2) ? 'Paid' : 'Pending', payMode: 'UPI', refText: `GPay-${80000 + idx}`, dueDate: '2026-04-10' },
        { installmentNo: 2, amount: Math.round(netFee / 2), paidAmount: paidTotal === netFee ? Math.round(netFee / 2) : 0, status: paidTotal === netFee ? 'Paid' : 'Pending', payMode: 'Bank Transfer', refText: `NFT-${90000 + idx}`, dueDate: '2026-08-10' }
      ]
    };
  });
};

const initialFees = generate80Fees(initialStudents);

const initialExpenses = [
  { _id: 'exp-1', title: 'Facility Rent & Maintenance', category: 'Rent', amount: 45000, date: '2026-08-01', remarks: 'Monthly lease payment' },
  { _id: 'exp-2', title: 'Lab Equipment Purchase', category: 'Equipment', amount: 25000, date: '2026-08-02', remarks: 'Chemistry glassware kits' }
];

const initialCertificates = initialStudents.slice(0, 10).map((std, idx) => ({
  _id: `cert-${idx + 1}`,
  certNumber: `ELH-CERT-2026-${1000 + idx}`,
  studentId: std._id,
  studentName: std.name,
  courseName: std.courseName,
  level: std.level || 'A1',
  grade: 'Distinction (A+)',
  marks: 92 + (idx % 8),
  issueDate: '2026-08-01',
  qrCodeUrl: `/verify/ELH-CERT-2026-${1000 + idx}`
}));

const generate200Books = () => {
  const titles = [
    'NCERT Mathematics Class 10', 'Concepts of Physics by HC Verma', 'Organic Chemistry Guide',
    'Fundamentals of Computer Science', 'History of Ancient India', 'Indian Economy Guide',
    'Higher Algebra by Hall & Knight', 'Oxford English Grammar', 'CEFR German A1 Kursbuch', 'DELF French Preparation'
  ];
  const books = [];
  for (let b = 1; b <= 200; b++) {
    books.push({
      _id: `bk-${b}`,
      title: `${titles[b % titles.length]} - Edition ${2020 + (b % 5)}`,
      author: `Author ${b}`,
      barcode: `IIA-BK-${1000 + b}`,
      isbn: `978-3-16-1484${String(b).padStart(3, '0')}-0`,
      category: b % 3 === 0 ? 'Science' : b % 2 === 0 ? 'Mathematics' : 'Literature',
      shelf: `Shelf ${(b % 10) + 1}`,
      rack: `Rack ${(b % 5) + 1}`,
      purchasePrice: 450 + (b % 10) * 50,
      status: b % 10 === 0 ? 'Issued' : 'Available'
    });
  }
  return books;
};

const initialBooks = generate200Books();

const initialBookIssues = initialStudents.slice(0, 20).map((std, iIdx) => ({
  _id: `iss-${iIdx + 1}`,
  bookId: initialBooks[iIdx]._id,
  bookTitle: initialBooks[iIdx].title,
  barcode: initialBooks[iIdx].barcode,
  borrowerName: std.name,
  borrowerRole: 'Student',
  issueDate: '2026-08-01',
  dueDate: '2026-08-15',
  returnDate: null,
  fineAmount: 0
}));

const initialHomeworks = teacherNames.map((t, idx) => ({
  _id: `hw-${idx + 1}`,
  title: `${t.split(' ')[0]} Subject Practice Assignment #${idx + 1}`,
  description: 'Solve problem set 1 to 15 from Chapter 3 textbook and submit PDF scan.',
  batchCode: initialBatches[idx % initialBatches.length].code,
  teacherName: t,
  dueDate: '2026-08-15',
  totalMarks: 100
}));

const initialHomeworkSubmissions = initialStudents.slice(0, 40).map((std, sIdx) => ({
  _id: `sub-${sIdx + 1}`,
  homeworkId: initialHomeworks[sIdx % initialHomeworks.length]._id,
  studentCode: std.studentId,
  studentName: std.name,
  submissionDate: '2026-08-06',
  fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  status: 'Evaluated',
  marksObtained: 78 + (sIdx % 20),
  teacherRemarks: 'Excellent syntax formation and structured step solutions.'
}));

const initialScholarships = initialStudents.slice(0, 5).map((std, idx) => ({
  _id: `sch-${idx + 1}`,
  studentCode: std.studentId,
  studentName: std.name,
  type: 'Merit Scholarship',
  percentage: 15,
  amount: 4500,
  reason: 'Scored Top Rank in Admissions Screening',
  status: 'Approved',
  approvedBy: 'Amit Sharma'
}));

const initialPTMs = initialStudents.slice(0, 15).map((std, pIdx) => ({
  _id: `ptm-${pIdx + 1}`,
  teacherName: std.teacherName,
  studentCode: std.studentId,
  studentName: std.name,
  parentName: std.fatherName,
  parentPhone: std.parentPhone,
  meetingDate: '2026-08-25',
  meetingTime: '10:30 AM',
  meetingType: 'Online',
  meetLink: 'https://meet.google.com/iia-ptm',
  status: pIdx % 2 === 0 ? 'Upcoming' : 'Completed'
}));

const initialExams = [
  { _id: 'ex-1', title: 'Unit Test 1 - Term 1', examType: 'Unit Test', session: '2026-27', batchCode: 'Class 10 A', subject: 'Mathematics', examDate: '2026-08-15', startTime: '09:00 AM', room: 'Aryabhata Hall', invigilatorName: 'Anita Sharma', totalMarks: 100, passingMarks: 33 },
  { _id: 'ex-2', title: 'Mid-Term Examinations 2026', examType: 'Mid Term', session: '2026-27', batchCode: 'Class 12 Science A', subject: 'Science & Physics', examDate: '2026-09-10', startTime: '09:00 AM', room: 'Aryabhata Hall', invigilatorName: 'Vikas Kumar', totalMarks: 100, passingMarks: 33 },
  { _id: 'ex-3', title: 'Final Board Series Test', examType: 'Final Exam', session: '2026-27', batchCode: 'JEE Morning', subject: 'Computer Science', examDate: '2026-10-05', startTime: '09:00 AM', room: 'Aryabhata Hall', invigilatorName: 'Rohit Sharma', totalMarks: 100, passingMarks: 33 }
];

const initialExamMarks = initialStudents.map((std, sIdx) => {
  const marks = 45 + (sIdx % 52);
  return {
    _id: `em-${sIdx + 1}`,
    examId: initialExams[sIdx % initialExams.length]._id,
    studentId: std._id,
    studentCode: std.studentId,
    studentName: std.name,
    marksObtained: marks,
    grade: marks >= 90 ? 'A+' : marks >= 75 ? 'A' : marks >= 60 ? 'B+' : marks >= 50 ? 'B' : 'C',
    rank: (sIdx % 10) + 1,
    teacherRemarks: 'Strong conceptual clarity shown in solution methodology.',
    approvalStatus: 'Published',
    publishedBy: 'Amit Sharma'
  };
});

const initialAcademicEvents = [
  { _id: 'evt-1', title: 'Independence Day Celebration & Flag Hoisting', eventType: 'Annual Function', startDate: '2026-08-15', endDate: '2026-08-15', targetRoles: ['All'], description: 'Institute Flag Hoisting ceremony followed by cultural program.' },
  { _id: 'evt-2', title: 'CBSE Mid-Term Examination Week', eventType: 'Exam', startDate: '2026-08-25', endDate: '2026-08-30', targetRoles: ['Student', 'Teacher'], description: 'Mid-term examinations across all academic classes.' }
];

const initialTransportRoutes = [
  { _id: 'rt-1', routeCode: 'R-101', routeName: 'Indiranagar - MG Road - Campus', stops: [{ stopName: 'Indiranagar Metro', pickupTime: '07:30 AM', fee: 2500 }], vehicleNo: 'KA-01-EA-1001', driverName: 'Sardar Singh', driverPhone: '+91 94455 66701' },
  { _id: 'rt-2', routeCode: 'R-102', routeName: 'Koramangala - HSR Layout - Campus', stops: [{ stopName: 'Koramangala 5th Block', pickupTime: '07:20 AM', fee: 2800 }], vehicleNo: 'KA-01-EA-1002', driverName: 'Ramesh Kumar', driverPhone: '+91 94455 66702' },
  { _id: 'rt-3', routeCode: 'R-103', routeName: 'Whitefield - ITPL Main Road - Campus', stops: [{ stopName: 'Whitefield Post Office', pickupTime: '07:10 AM', fee: 3000 }], vehicleNo: 'KA-01-EA-1003', driverName: 'Prakash Patil', driverPhone: '+91 94455 66703' }
];

const initialVehicles = [
  { _id: 'vh-1', vehicleNo: 'KA-01-EA-1001', model: 'Tata Starbus 40 Seater', capacity: 40, driverName: 'Sardar Singh', insuranceExpiry: '2027-03-31', fitnessExpiry: '2027-05-15', status: 'Active' },
  { _id: 'vh-2', vehicleNo: 'KA-01-EA-1002', model: 'Eicher Skyline Pro 45 Seater', capacity: 45, driverName: 'Ramesh Kumar', insuranceExpiry: '2027-04-30', fitnessExpiry: '2027-06-15', status: 'Active' },
  { _id: 'vh-3', vehicleNo: 'KA-01-EA-1003', model: 'Ashok Leyland Sunshine 50 Seater', capacity: 50, driverName: 'Prakash Patil', insuranceExpiry: '2027-05-31', fitnessExpiry: '2027-07-15', status: 'Active' }
];

const initialAssets = [
  { _id: 'ast-1', name: 'Dell OptiPlex 7090 Desktop (Computer Lab 1)', assetCode: 'IIA-AST-1001', category: 'Computers', purchaseDate: '2025-06-15', purchasePrice: 55000, vendor: 'Dell India', status: 'Available', room: 'Computer Lab 101' },
  { _id: 'ast-2', name: 'Epson EB-E01 Classroom Projector', assetCode: 'IIA-AST-2001', category: 'Projectors', purchaseDate: '2025-08-20', purchasePrice: 38000, vendor: 'Epson India', status: 'Available', room: 'Aryabhata Hall' },
  { _id: 'ast-3', name: 'Dual Student Classroom Bench & Desk Set', assetCode: 'IIA-AST-3001', category: 'Furniture', purchaseDate: '2025-04-10', purchasePrice: 12000, vendor: 'Godrej Furniture', status: 'Available', room: 'Room 102' },
  { _id: 'ast-4', name: 'Advanced Chemistry Practical Glassware Kit', assetCode: 'IIA-AST-4001', category: 'Lab Equipment', purchaseDate: '2025-11-05', purchasePrice: 25000, vendor: 'Borosil Scientific', status: 'Available', room: 'Chemistry Lab' }
];

const initialNotices = [
  { _id: 'ntc-1', title: 'CBSE Mid-Term Examination Schedule Announcement', content: 'Detailed timetable for Class 9 to Class 12 Mid-Term tests has been published.', category: 'General', priority: 'High', isPinned: true, createdAt: '2026-08-05' },
  { _id: 'ntc-2', title: 'Parent Teacher Conference Reminder', content: 'Virtual PTM scheduled for August 25 via Google Meet.', category: 'PTM', priority: 'High', isPinned: true, createdAt: '2026-08-06' }
];

const initialChatMessages = [
  { _id: 'msg-1', senderName: 'Amit Sharma', senderRole: 'Owner', recipientId: 'usr-teacher-1', text: 'Please ensure mid-term answer scripts are uploaded by Friday.', createdAt: '2026-08-06 10:15 AM' }
];

const initialLeaveRequests = [
  { _id: 'lv-1', applicantId: 'usr-teacher-1', applicantName: 'Anita Sharma', applicantRole: 'Teacher', leaveType: 'Casual', startDate: '2026-08-15', endDate: '2026-08-16', reason: 'Educational symposium', substituteTeacher: 'Vikas Kumar', status: 'Approved' },
  { _id: 'lv-2', applicantId: 'usr-teacher-3', applicantName: 'Sneha Gupta', applicantRole: 'Teacher', leaveType: 'Medical', startDate: '2026-08-20', endDate: '2026-08-22', reason: 'Viral fever rest', substituteTeacher: 'Rohit Sharma', status: 'Pending' }
];

const initialAttendanceLogs = [
  { _id: 'att-1', batchCode: 'GER-A1-B01', date: '2026-08-06', entries: [{ studentId: 'IIA-1001', studentName: 'Aarav Gupta', status: 'Present' }] },
];

const initialTimetableSlots = [
  { _id: 'slot-1', batchCode: 'GER-A1-B01', courseName: 'German', level: 'A1', teacherName: 'Prof. Amit Kulkarni', room: 'Aryabhata Hall (Room 102)', dayOfWeek: 'Mon', startTime: '09:00 AM', endTime: '11:00 AM' },
];

const initialTeacherAttendanceLogs = [];

const initialAuditLogs = [
  { _id: 'log-1', userName: 'Vikramaditya Roy', userRole: 'Owner', action: 'System Audit Completed & Handlers Initialized', module: 'System', timestamp: new Date().toLocaleString('en-IN') },
];

export const useAppStore = create((set, get) => ({
  isAuthenticated: !!localStorage.getItem('elh_auth_token'),
  theme: 'dark',
  activeRole: localStorage.getItem('elh_user_role') || 'Owner',
  currentUser: {
    ...initialRegisteredUsers[0],
    role: localStorage.getItem('elh_user_role') || 'Owner',
    name: localStorage.getItem('elh_user_name') || 'Vikramaditya Roy (Institute Owner)',
  },
  isAiDrawerOpen: false,

  users: initialRegisteredUsers,
  customRoles: initialCustomRoles,
  leads: initialLeads,
  students: initialStudents,
  courses: initialCourses,
  batches: initialBatches,
  fees: initialFees,
  expenses: initialExpenses,
  certificates: initialCertificates,
  books: initialBooks,
  bookIssues: initialBookIssues,
  homeworks: initialHomeworks,
  homeworkSubmissions: initialHomeworkSubmissions,
  scholarships: initialScholarships,
  ptms: initialPTMs,

  subjects: initialSubjects,
  academicYears: initialAcademicYears,
  schoolClasses: initialSchoolClasses,

  // Modules 5–11 Data
  exams: initialExams,
  examMarks: initialExamMarks,
  academicEvents: initialAcademicEvents,
  transportRoutes: initialTransportRoutes,
  vehicles: initialVehicles,
  assets: initialAssets,
  notices: initialNotices,
  chatMessages: initialChatMessages,
  leaveRequests: initialLeaveRequests,
  attendanceLogs: initialAttendanceLogs,
  timetableSlots: initialTimetableSlots,
  teacherAttendanceLogs: initialTeacherAttendanceLogs,
  auditLogs: initialAuditLogs,

  // Academic Program, Subject & Promotion Actions
  addSubject: (subjectData) => {
    const newSubject = {
      _id: `sb-${Date.now()}`,
      code: subjectData.code || `SUB-${Math.floor(100 + Math.random() * 900)}`,
      name: subjectData.name,
      teacherName: subjectData.teacherName || 'Prof. Amit Kulkarni',
      weeklyClasses: Number(subjectData.weeklyClasses) || 5,
      maxMarks: Number(subjectData.maxMarks) || 100,
      passingMarks: Number(subjectData.passingMarks) || 33,
      isPractical: !!subjectData.isPractical,
    };
    set({ subjects: [newSubject, ...get().subjects] });
    get().logActivity(`Added subject curriculum: ${newSubject.name} (${newSubject.code})`, 'Academics');
  },

  addAcademicYear: (yearData) => {
    const newYear = {
      _id: `ay-${Date.now()}`,
      code: yearData.code,
      name: yearData.name || `Academic Session ${yearData.code}`,
      startDate: yearData.startDate,
      endDate: yearData.endDate,
      isCurrent: !!yearData.isCurrent,
      status: yearData.status || 'Active',
    };
    const updatedYears = yearData.isCurrent
      ? get().academicYears.map((y) => ({ ...y, isCurrent: false }))
      : get().academicYears;
    set({ academicYears: [newYear, ...updatedYears] });
    get().logActivity(`Created academic session: ${newYear.code}`, 'Academics');
  },

  addSchoolClass: (classData) => {
    const newClass = {
      _id: `cls-${Date.now()}`,
      name: classData.name,
      code: classData.code || classData.name.substring(0, 5).toUpperCase(),
      category: classData.category || 'Primary',
      programType: 'School_K12',
      sections: classData.sections || [{ code: 'Section A', teacherName: 'Prof. Amit Kulkarni', capacity: 35 }],
      streams: classData.streams || [],
      baseFee: Number(classData.baseFee) || 30000,
    };
    set({ schoolClasses: [newClass, ...get().schoolClasses] });
    get().logActivity(`Added school class: ${newClass.name}`, 'Academics');
  },

  promoteStudents: (sourceClassCode, targetClassCode, selectedStudentIds = []) => {
    const updatedStudents = get().students.map((std) => {
      const isTarget = selectedStudentIds.length === 0 ? std.level === sourceClassCode || std.courseName.includes(sourceClassCode) : selectedStudentIds.includes(std._id);
      if (!isTarget) return std;

      const timelineEntry = {
        date: new Date().toISOString().split('T')[0],
        title: `Promoted to ${targetClassCode}`,
        description: `Academic Session Promotion from ${sourceClassCode} to ${targetClassCode}`,
        badge: 'Promoted',
      };

      return {
        ...std,
        level: targetClassCode,
        courseName: targetClassCode.includes('Class') || targetClassCode.includes('STD') ? targetClassCode : std.courseName,
        timeline: [timelineEntry, ...(std.timeline || [])],
      };
    });

    set({ students: updatedStudents });
    get().logActivity(`Promoted students from ${sourceClassCode} to ${targetClassCode}`, 'Academics');
  },

  // Auth Actions
  loginUser: (emailOrPhone, passwordAttempt) => {
    const input = emailOrPhone.trim().toLowerCase();
    const user = get().users.find(
      (u) => u.email.toLowerCase() === input || (u.phone && u.phone.includes(input)) || u.id.toLowerCase() === input
    );

    if (!user) return { success: false, message: `No account found matching "${emailOrPhone}".` };
    if (!user.isActive) return { success: false, message: `Account "${user.name}" is deactivated.` };
    if (user.password && user.password !== passwordAttempt) return { success: false, message: 'Invalid password.' };

    localStorage.setItem('elh_auth_token', `token-${user.id}-${Date.now()}`);
    localStorage.setItem('elh_user_role', user.role);
    localStorage.setItem('elh_user_name', user.name);

    set({ isAuthenticated: true, activeRole: user.role, currentUser: user });
    get().logActivity(`Logged into system (${user.role})`, 'Auth');
    return { success: true };
  },

  logoutUser: () => {
    get().logActivity('Logged out of system', 'Auth');
    localStorage.removeItem('elh_auth_token');
    localStorage.removeItem('elh_user_role');
    localStorage.removeItem('elh_user_name');
    set({ isAuthenticated: false });
  },

  // CRM Actions
  addLead: (leadData) => {
    const newLead = {
      _id: `ld-${Date.now()}`,
      name: leadData.name || 'New Candidate',
      parentName: leadData.parentName || '',
      aadhaarNo: leadData.aadhaarNo || '',
      phone: leadData.phone || '+91 99000 00000',
      whatsapp: leadData.whatsapp || leadData.phone || '+91 99000 00000',
      email: leadData.email || 'candidate@gmail.com',
      city: leadData.city || 'Bengaluru',
      course: leadData.course || 'German Language',
      language: leadData.language || 'German',
      level: leadData.level || 'A1',
      quotedFee: Number(leadData.quotedFee) || 25000,
      source: leadData.source || 'Walk-in',
      status: 'New',
      notes: [],
      callHistory: [],
      createdAt: new Date().toISOString(),
    };
    set({ leads: [newLead, ...get().leads] });
    get().logActivity(`Created new lead: ${newLead.name}`, 'CRM');
  },

  updateLeadStatus: (leadId, newStatus) => {
    set({
      leads: get().leads.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l)),
    });
    get().logActivity(`Updated lead ID ${leadId} status to ${newStatus}`, 'CRM');
  },

  addLeadNote: (leadId, text) => {
    set({
      leads: get().leads.map((l) =>
        l._id === leadId
          ? {
              ...l,
              notes: [...(l.notes || []), { text, by: get().currentUser.name, at: new Date().toISOString() }],
            }
          : l
      ),
    });
    get().logActivity(`Added note to lead ID ${leadId}`, 'CRM');
  },

  addCallHistory: (leadId, callData) => {
    set({
      leads: get().leads.map((l) =>
        l._id === leadId
          ? {
              ...l,
              callHistory: [
                ...(l.callHistory || []),
                {
                  durationSeconds: callData.durationSeconds,
                  notes: callData.notes,
                  outcome: callData.outcome,
                  date: new Date().toISOString(),
                },
              ],
              status: callData.outcome || l.status,
            }
          : l
      ),
    });
    get().logActivity(`Logged call for lead ID ${leadId}`, 'CRM');
  },

  convertLeadToStudent: (leadId, selectedBatchCode = 'GER-A1-B01') => {
    const lead = get().leads.find((l) => l._id === leadId);
    if (!lead) return;

    const targetBatch = get().batches.find((b) => b.code === selectedBatchCode) || get().batches[0];
    const studentCode = `IIA-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent = {
      _id: `std-${Date.now()}`,
      studentId: studentCode,
      name: lead.name,
      fatherName: lead.parentName || 'Parent',
      motherName: '',
      guardianName: lead.parentName || 'Parent',
      phone: lead.phone,
      whatsapp: lead.whatsapp || lead.phone,
      email: lead.email,
      parentPhone: lead.phone,
      parentWhatsapp: lead.whatsapp || lead.phone,
      parentEmail: lead.email,
      parentOccupation: 'Business / Professional',
      emergencyContact: lead.phone,
      verificationStatus: 'Verified', // Verified by default upon enrolment
      courseName: lead.language || lead.course || 'German',
      level: lead.level || 'A1',
      packageType: 'Quarterly Package',
      batchCode: targetBatch ? targetBatch.code : 'GER-A1-B01',
      teacherName: targetBatch ? targetBatch.teacherName : 'Prof. Amit Kulkarni',
      joiningDate: new Date().toISOString().split('T')[0],
      admissionDate: new Date().toISOString().split('T')[0],
      isActive: true,
      timeline: [
        { title: 'Admission Completed', detail: `Converted from lead (${lead.source}). Assigned to ${targetBatch ? targetBatch.code : 'GER-A1-B01'}.`, by: get().currentUser.name, at: new Date().toISOString() },
        { title: 'Student Portal Generated', detail: `Portal ID ${studentCode} created with active status.`, by: 'System Engine', at: new Date().toISOString() }
      ]
    };

    const newFee = {
      _id: `fee-${Date.now()}`,
      studentId: newStudent._id,
      studentCode,
      studentName: lead.name,
      courseName: `${lead.language || 'German'} ${lead.level || 'A1'}`,
      totalFee: lead.quotedFee || 25000,
      discount: 0,
      netFee: lead.quotedFee || 25000,
      paidTotal: 0,
      remainingTotal: lead.quotedFee || 25000,
      status: 'Unpaid',
      installments: [
        { installmentNo: 1, amount: (lead.quotedFee || 25000) / 2, paidAmount: 0, status: 'Pending' },
        { installmentNo: 2, amount: (lead.quotedFee || 25000) / 2, paidAmount: 0, status: 'Pending' },
      ],
    };

    const newNotice = {
      _id: `ntc-${Date.now()}`,
      title: `Welcome New Student: ${newStudent.name} (${studentCode})`,
      content: `${newStudent.name} has been enrolled into batch ${newStudent.batchCode} under ${newStudent.teacherName}.`,
      category: 'Admission',
      priority: 'Normal',
      isPinned: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Update batch student count
    const updatedBatches = get().batches.map((b) =>
      b.code === newStudent.batchCode ? { ...b, currentStudents: (b.currentStudents || 0) + 1 } : b
    );

    set({
      leads: get().leads.map((l) => (l._id === leadId ? { ...l, status: 'Admission' } : l)),
      students: [newStudent, ...get().students],
      fees: [newFee, ...get().fees],
      batches: updatedBatches,
      notices: [newNotice, ...get().notices],
    });

    get().logActivity(`Converted lead ${lead.name} to enrolled student (${studentCode}) - Auto Cascade Complete`, 'Admissions');
  },

  // Student Actions
  registerDirectStudent: (studentForm) => {
    const targetBatch = get().batches.find((b) => b.code === studentForm.batchCode) || get().batches[0];
    const studentCode = `IIA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudent = {
      _id: `std-${Date.now()}`,
      studentId: studentCode,
      name: studentForm.name,
      fatherName: studentForm.fatherName || studentForm.parentName || '',
      motherName: studentForm.motherName || '',
      guardianName: studentForm.parentName || studentForm.fatherName || 'Parent',
      phone: studentForm.phone,
      whatsapp: studentForm.whatsapp || studentForm.phone,
      email: studentForm.email,
      parentPhone: studentForm.parentPhone || studentForm.phone,
      parentWhatsapp: studentForm.parentWhatsapp || studentForm.phone,
      parentEmail: studentForm.parentEmail || studentForm.email,
      parentOccupation: studentForm.parentOccupation || 'Business / Service',
      emergencyContact: studentForm.emergencyContact || studentForm.phone,
      verificationStatus: studentForm.verificationStatus || 'Verified',
      courseName: studentForm.courseName || 'German',
      level: studentForm.level || 'A1',
      packageType: studentForm.packageType || 'Quarterly Package',
      batchCode: studentForm.batchCode || 'GER-A1-B01',
      teacherName: targetBatch ? targetBatch.teacherName : 'Prof. Amit Kulkarni',
      joiningDate: new Date().toISOString().split('T')[0],
      admissionDate: new Date().toISOString().split('T')[0],
      isActive: true,
      timeline: [
        { title: 'Direct Enrolment Created', detail: `Registered directly by ${get().currentUser.name}. Assigned to ${studentForm.batchCode || 'GER-A1-B01'}.`, by: get().currentUser.name, at: new Date().toISOString() }
      ]
    };

    const newFee = {
      _id: `fee-${Date.now()}`,
      studentId: newStudent._id,
      studentCode,
      studentName: studentForm.name,
      courseName: `${studentForm.courseName} ${studentForm.level}`,
      totalFee: Number(studentForm.baseFee) || 25000,
      discount: 0,
      netFee: Number(studentForm.baseFee) || 25000,
      paidTotal: 0,
      remainingTotal: Number(studentForm.baseFee) || 25000,
      status: 'Unpaid',
      installments: [
        { installmentNo: 1, amount: (Number(studentForm.baseFee) || 25000) / 2, paidAmount: 0, status: 'Pending' },
        { installmentNo: 2, amount: (Number(studentForm.baseFee) || 25000) / 2, paidAmount: 0, status: 'Pending' },
      ],
    };

    const updatedBatches = get().batches.map((b) =>
      b.code === newStudent.batchCode ? { ...b, currentStudents: (b.currentStudents || 0) + 1 } : b
    );

    set({
      students: [newStudent, ...get().students],
      fees: [newFee, ...get().fees],
      batches: updatedBatches,
    });
    get().logActivity(`Registered direct student ${newStudent.name} (${studentCode}) - Auto Cascade Complete`, 'Students');
  },

  updateStudentVerificationStatus: (studentId, newStatus) => {
    set({
      students: get().students.map((s) =>
        s._id === studentId || s.studentId === studentId
          ? {
              ...s,
              verificationStatus: newStatus,
              timeline: [
                ...(s.timeline || []),
                { title: `Verification Status Updated`, detail: `Status changed to ${newStatus}`, by: get().currentUser.name, at: new Date().toISOString() }
              ]
            }
          : s
      )
    });
    get().logActivity(`Updated verification status for student ${studentId} to ${newStatus}`, 'Students');
  },

  // Course Actions
  addCourse: (courseData) => {
    const newCourse = {
      _id: `crs-${Date.now()}`,
      name: courseData.name,
      code: courseData.code,
      description: courseData.description || 'Program curriculum details',
      levels: [
        {
          code: courseData.levelCode || 'A1',
          baseFee: Number(courseData.baseFee) || 25000,
          durationWeeks: Number(courseData.durationWeeks) || 8,
          totalClasses: Number(courseData.totalClasses) || 40,
        },
      ],
      packages: [
        { name: 'Monthly Package', fee: Math.round((Number(courseData.baseFee) || 25000) / 3), discountPercentage: 0, durationMonths: 1 },
        { name: 'Quarterly Package', fee: Number(courseData.baseFee) || 25000, discountPercentage: 5, durationMonths: 3 },
        { name: 'Half-Yearly Package', fee: Math.round((Number(courseData.baseFee) || 25000) * 1.8), discountPercentage: 10, durationMonths: 6 },
        { name: 'Yearly Package', fee: Math.round((Number(courseData.baseFee) || 25000) * 3.2), discountPercentage: 15, durationMonths: 12 },
      ]
    };
    set({ courses: [newCourse, ...get().courses] });
    get().logActivity(`Added course program: ${newCourse.name}`, 'Courses');
  },

  // Batch Actions
  addBatch: (batchForm) => {
    const newBatch = {
      _id: `btc-${Date.now()}`,
      code: batchForm.code,
      courseName: batchForm.courseName,
      level: batchForm.level,
      teacherName: batchForm.teacherName,
      room: batchForm.room,
      timing: batchForm.timing,
      days: batchForm.days || ['Mon', 'Wed', 'Fri'],
      maxStudents: Number(batchForm.maxStudents) || 15,
      currentStudents: 0,
      status: 'Ongoing',
      startDate: new Date().toISOString().split('T')[0],
    };
    set({ batches: [newBatch, ...get().batches] });
    get().logActivity(`Created new batch: ${newBatch.code}`, 'Batches');
  },

  updateBatchSchedule: (batchId, newTiming, newRoom, isTemporary = false) => {
    const batch = get().batches.find((b) => b._id === batchId || b.code === batchId);
    if (!batch) return;

    const updatedBatches = get().batches.map((b) =>
      b._id === batchId || b.code === batchId ? { ...b, timing: newTiming, room: newRoom } : b
    );

    // Update timetable slots
    const updatedSlots = (get().timetableSlots || []).map((slot) =>
      slot.batchCode === batch.code ? { ...slot, startTime: newTiming.split(' - ')[0] || slot.startTime, room: newRoom } : slot
    );

    // Broadcast Notice notification
    const newNotice = {
      _id: `ntc-${Date.now()}`,
      title: `Schedule Alert: Batch ${batch.code} Timing Updated`,
      content: `${isTemporary ? '[Temporary Override] ' : ''}Batch ${batch.code} timing updated to ${newTiming} in ${newRoom}. All assigned students and teachers please take note.`,
      category: 'Academic',
      priority: 'High',
      isPinned: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    set({
      batches: updatedBatches,
      timetableSlots: updatedSlots,
      notices: [newNotice, ...get().notices],
    });
    get().logActivity(`Updated schedule for batch ${batch.code} (${isTemporary ? 'Temporary Override' : 'Permanent'})`, 'Batches');
  },

  addTimetableSlot: (slotForm) => {
    const conflict = (get().timetableSlots || []).find(
      (s) => s.room === slotForm.room && s.dayOfWeek === slotForm.dayOfWeek && s.startTime === slotForm.startTime
    );

    if (conflict) {
      return { success: false, conflictMessage: `Room ${slotForm.room} is already booked for ${slotForm.dayOfWeek} at ${slotForm.startTime}.` };
    }

    const newSlot = {
      _id: `slot-${Date.now()}`,
      ...slotForm,
    };
    set({ timetableSlots: [newSlot, ...(get().timetableSlots || [])] });
    get().logActivity(`Added timetable slot for batch ${slotForm.batchCode}`, 'Batches');
    return { success: true };
  },

  saveTeacherAttendance: (teacherId, status, checkInTime, checkOutTime) => {
    const log = {
      _id: `tatt-${Date.now()}`,
      teacherId,
      teacherName: get().currentUser.name,
      date: new Date().toISOString().split('T')[0],
      status,
      checkInTime,
      checkOutTime,
    };
    set({ teacherAttendanceLogs: [log, ...(get().teacherAttendanceLogs || [])] });
    get().logActivity(`Teacher check-in recorded for ${log.teacherName}`, 'Batches');
  },

  // Attendance Actions
  saveDailyAttendanceLog: (batchCode, date, entries) => {
    const existingIndex = (get().attendanceLogs || []).findIndex(
      (l) => l.batchCode === batchCode && l.date === date
    );

    const logObj = {
      _id: existingIndex >= 0 ? get().attendanceLogs[existingIndex]._id : `att-${Date.now()}`,
      batchCode,
      date,
      entries,
    };

    let updatedLogs = [];
    if (existingIndex >= 0) {
      updatedLogs = [...get().attendanceLogs];
      updatedLogs[existingIndex] = logObj;
    } else {
      updatedLogs = [logObj, ...(get().attendanceLogs || [])];
    }

    set({ attendanceLogs: updatedLogs });
    get().logActivity(`Logged attendance for batch ${batchCode} on ${date}`, 'Attendance');
  },

  // Fee Actions
  payInstallment: (feeId, installmentNo, amount, payMode, refText) => {
    set({
      fees: get().fees.map((f) => {
        if (f._id !== feeId) return f;
        const newPaidTotal = f.paidTotal + amount;
        const newRemaining = Math.max(0, f.netFee - newPaidTotal);
        const updatedInsts = f.installments.map((inst) =>
          inst.installmentNo === installmentNo
            ? { ...inst, paidAmount: amount, status: 'Paid', payMode, refText, paidDate: new Date().toISOString().split('T')[0] }
            : inst
        );

        return {
          ...f,
          paidTotal: newPaidTotal,
          remainingTotal: newRemaining,
          status: newRemaining === 0 ? 'Paid' : 'Partial',
          installments: updatedInsts,
        };
      }),
    });
    get().logActivity(`Recorded fee payment of ₹${amount} via ${payMode}`, 'Fees');
  },

  // Expense Actions
  addExpense: (expenseData) => {
    const newExp = {
      _id: `exp-${Date.now()}`,
      title: expenseData.remarks || `${expenseData.category} Payment`,
      category: expenseData.category,
      amount: Number(expenseData.amount),
      date: expenseData.date || new Date().toISOString().split('T')[0],
      remarks: expenseData.remarks,
    };
    set({ expenses: [newExp, ...get().expenses] });
    get().logActivity(`Logged expense: ${newExp.title} (₹${newExp.amount})`, 'Expenses');
  },

  // Certificate Actions
  generateCertificate: (student, grade, marks) => {
    const certNum = `IIA-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert = {
      _id: `cert-${Date.now()}`,
      certNumber: certNum,
      studentId: student._id || student.studentId,
      studentName: student.name,
      courseName: student.courseName || 'German Language',
      level: student.level || 'A1',
      grade: grade || 'Distinction (A+)',
      marks: marks || 94,
      issueDate: new Date().toISOString().split('T')[0],
      qrCodeUrl: `/verify/${certNum}`,
    };
    set({ certificates: [newCert, ...get().certificates] });
    get().logActivity(`Generated certificate ${certNum} for ${student.name}`, 'Certificates');
  },

  // Library Actions
  addBook: (bookData) => {
    const newBook = {
      _id: `bk-${Date.now()}`,
      title: bookData.title,
      author: bookData.author,
      category: bookData.category,
      isbn: bookData.isbn || `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
      barcode: `IIA-BK-${Math.floor(9000 + Math.random() * 1000)}`,
      shelf: bookData.shelf || 'Shelf A',
      rack: bookData.rack || 'Rack 01',
      purchasePrice: Number(bookData.purchasePrice) || 1500,
      status: 'Available',
    };
    set({ books: [newBook, ...get().books] });
    get().logActivity(`Added library book: ${newBook.title}`, 'Library');
  },

  issueBook: (bookId, issueData) => {
    const book = get().books.find((b) => b._id === bookId);
    if (!book) return;

    const newIssue = {
      _id: `iss-${Date.now()}`,
      bookId: book._id,
      bookTitle: book.title,
      barcode: book.barcode,
      borrowerName: issueData.borrowerName,
      borrowerRole: issueData.borrowerRole || 'Student',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: issueData.dueDate,
      returnDate: null,
      fineAmount: 0,
    };

    set({
      books: get().books.map((b) => (b._id === bookId ? { ...b, status: 'Issued' } : b)),
      bookIssues: [newIssue, ...get().bookIssues],
    });
    get().logActivity(`Issued book "${book.title}" to ${issueData.borrowerName}`, 'Library');
  },

  returnBook: (issueId) => {
    const issue = get().bookIssues.find((i) => i._id === issueId);
    if (!issue) return;

    set({
      books: get().books.map((b) => (b._id === issue.bookId ? { ...b, status: 'Available' } : b)),
      bookIssues: get().bookIssues.map((i) =>
        i._id === issueId ? { ...i, returnDate: new Date().toISOString().split('T')[0] } : i
      ),
    });
    get().logActivity(`Returned book "${issue.bookTitle}"`, 'Library');
  },

  // Homework Actions
  addHomework: (hwData) => {
    const newHw = {
      _id: `hw-${Date.now()}`,
      title: hwData.title,
      description: hwData.description,
      batchCode: hwData.batchCode,
      teacherName: get().currentUser.name,
      dueDate: hwData.dueDate,
      totalMarks: Number(hwData.totalMarks) || 50,
    };
    set({ homeworks: [newHw, ...get().homeworks] });
    get().logActivity(`Created homework assignment: ${newHw.title}`, 'Homework');
  },

  submitHomework: (subData) => {
    const newSub = {
      _id: `sub-${Date.now()}`,
      homeworkId: subData.homeworkId,
      studentCode: get().currentUser.id || 'IIA-1001',
      studentName: get().currentUser.name,
      submissionDate: new Date().toISOString().split('T')[0],
      fileUrl: subData.fileUrl || '/docs/submission.pdf',
      status: 'Submitted',
      marksObtained: 0,
      teacherRemarks: '',
    };
    set({ homeworkSubmissions: [newSub, ...get().homeworkSubmissions] });
    get().logActivity(`Submitted homework for assignment ID ${subData.homeworkId}`, 'Homework');
  },

  gradeHomework: (subId, marksObtained, teacherRemarks) => {
    set({
      homeworkSubmissions: get().homeworkSubmissions.map((s) =>
        s._id === subId
          ? { ...s, marksObtained: Number(marksObtained), teacherRemarks, status: 'Evaluated' }
          : s
      ),
    });
    get().logActivity(`Evaluated homework submission ID ${subId}`, 'Homework');
  },

  // Scholarship Actions
  requestScholarship: (schData) => {
    const student = get().students.find((s) => s._id === schData.studentId || s.studentId === schData.studentId) || { name: 'Aarav Gupta', studentId: 'IIA-1001' };
    const newSch = {
      _id: `sch-${Date.now()}`,
      studentCode: student.studentId || 'IIA-1001',
      studentName: student.name,
      type: schData.type,
      percentage: Number(schData.percentage) || 10,
      amount: Number(schData.amount) || 2500,
      reason: schData.reason,
      status: 'Pending',
      approvedBy: '',
    };
    set({ scholarships: [newSch, ...get().scholarships] });
    get().logActivity(`Requested scholarship concession for ${newSch.studentName}`, 'Scholarship');
  },

  approveScholarship: (schId, isApproved) => {
    const newStatus = isApproved ? 'Approved' : 'Rejected';
    set({
      scholarships: get().scholarships.map((s) =>
        s._id === schId ? { ...s, status: newStatus, approvedBy: get().currentUser.name } : s
      ),
    });
    get().logActivity(`Scholarship request ${newStatus} for ID ${schId}`, 'Scholarship');
  },

  // PTM Actions
  schedulePTM: (ptmData) => {
    const newPtm = {
      _id: `ptm-${Date.now()}`,
      teacherName: ptmData.teacherName || get().currentUser.name,
      studentCode: ptmData.studentCode || 'IIA-1001',
      studentName: ptmData.studentName || 'Aarav Gupta',
      parentName: ptmData.parentName || 'Ramesh Gupta',
      parentPhone: ptmData.parentPhone || '+91 93344 55667',
      meetingDate: ptmData.meetingDate,
      meetingTime: ptmData.meetingTime,
      meetingType: ptmData.meetingType || 'Online',
      meetLink: ptmData.meetLink || 'https://meet.google.com/iia-ptm',
      status: 'Upcoming',
    };
    set({ ptms: [newPtm, ...get().ptms] });
    get().logActivity(`Scheduled PTM for student ${newPtm.studentName}`, 'PTM');
  },

  updatePTMStatus: (ptmId, newStatus) => {
    set({
      ptms: get().ptms.map((p) => (p._id === ptmId ? { ...p, status: newStatus } : p)),
    });
    get().logActivity(`Updated PTM status to ${newStatus} for ID ${ptmId}`, 'PTM');
  },

  // User & Role Actions
  addUserAccount: (userForm) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone || '+91 90000 00000',
      password: userForm.password || 'password123',
      role: userForm.role || 'Counsellor',
      customRoleTitle: userForm.customRoleTitle || userForm.role,
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };
    set({ users: [...get().users, newUser] });
    get().logActivity(`Created user account: ${newUser.name} (${newUser.role})`, 'Settings');
  },

  updateUserAccount: (userId, updatedData) => {
    set({
      users: get().users.map((u) => (u.id === userId ? { ...u, ...updatedData } : u)),
    });
    get().logActivity(`Updated user account ID ${userId}`, 'Settings');
  },

  deleteUserAccount: (userId) => {
    set({
      users: get().users.filter((u) => u.id !== userId),
    });
    get().logActivity(`Deleted user account ID ${userId}`, 'Settings');
  },

  addCustomRole: (roleForm) => {
    const newRole = {
      id: `role-${Date.now()}`,
      name: roleForm.name,
      parentRole: roleForm.parentRole,
      rank: (ROLE_RANKS[roleForm.parentRole] ?? 3) + 1,
      description: roleForm.description,
      createdBy: get().currentUser.name,
    };
    set({ customRoles: [...get().customRoles, newRole] });
    get().logActivity(`Added custom role: ${newRole.name}`, 'Settings');
  },

  deleteCustomRole: (roleId) => {
    set({
      customRoles: get().customRoles.filter((r) => r.id !== roleId),
    });
    get().logActivity(`Deleted custom role ID ${roleId}`, 'Settings');
  },

  // Module 5: Exams Actions
  addExam: (examData) => {
    const newExam = {
      _id: `ex-${Date.now()}`,
      title: examData.title || 'Mid-Term Assessment',
      examType: examData.examType || 'Mid Term',
      session: '2026-27',
      batchCode: examData.batchCode || 'GER-A1-B01',
      subject: examData.subject || 'German Syntax',
      examDate: examData.examDate || new Date().toISOString().split('T')[0],
      startTime: examData.startTime || '09:00 AM',
      room: examData.room || 'Aryabhata Hall',
      invigilatorName: examData.invigilatorName || get().currentUser.name,
      totalMarks: Number(examData.totalMarks) || 100,
      passingMarks: Number(examData.passingMarks) || 50,
    };
    set({ exams: [newExam, ...get().exams] });
    get().logActivity(`Created exam: ${newExam.title}`, 'Exams');
  },

  recordExamMarks: (markData) => {
    const newMark = {
      _id: `em-${Date.now()}`,
      examId: markData.examId,
      studentId: markData.studentId,
      studentCode: markData.studentCode || 'IIA-1001',
      studentName: markData.studentName || 'Aarav Gupta',
      marksObtained: Number(markData.marksObtained),
      grade: markData.marksObtained >= 90 ? 'A+' : markData.marksObtained >= 75 ? 'A' : 'B',
      rank: 1,
      teacherRemarks: markData.teacherRemarks || 'Good performance',
    };
    set({ examMarks: [newMark, ...get().examMarks] });
    get().logActivity(`Recorded exam mark for student ${newMark.studentName}`, 'Exams');
  },

  // Module 6: Academic Calendar Actions
  addAcademicEvent: (eventData) => {
    const newEvt = {
      _id: `evt-${Date.now()}`,
      title: eventData.title || 'School Event',
      eventType: eventData.eventType || 'Class Events',
      startDate: eventData.startDate || new Date().toISOString().split('T')[0],
      endDate: eventData.endDate || new Date().toISOString().split('T')[0],
      targetRoles: eventData.targetRoles || ['All'],
      description: eventData.description || 'School event details',
    };
    set({ academicEvents: [newEvt, ...get().academicEvents] });
    get().logActivity(`Created academic event: ${newEvt.title}`, 'Calendar');
  },

  // Module 7: Transport Actions
  addTransportRoute: (routeData) => {
    const newRoute = {
      _id: `rt-${Date.now()}`,
      routeCode: routeData.routeCode || 'R-102',
      routeName: routeData.routeName || 'Campus Express',
      stops: routeData.stops || [],
      vehicleNo: routeData.vehicleNo || 'KA-01-EQ-9988',
      driverName: routeData.driverName || 'Sardar Singh',
    };
    set({ transportRoutes: [newRoute, ...get().transportRoutes] });
    get().logActivity(`Added transport route: ${newRoute.routeName}`, 'Transport');
  },

  addVehicle: (vehicleData) => {
    const newVehicle = {
      _id: `vh-${Date.now()}`,
      vehicleNo: vehicleData.vehicleNo,
      model: vehicleData.model || 'Tata Bus',
      capacity: Number(vehicleData.capacity) || 40,
      driverName: vehicleData.driverName || 'Sardar Singh',
      insuranceExpiry: '2027-12-31',
      fitnessExpiry: '2027-12-31',
      status: 'Active',
    };
    set({ vehicles: [newVehicle, ...get().vehicles] });
    get().logActivity(`Added vehicle: ${newVehicle.vehicleNo}`, 'Transport');
  },

  // Module 8: Inventory Asset Actions
  addAsset: (assetData) => {
    const newAsset = {
      _id: `ast-${Date.now()}`,
      name: assetData.name || 'New Hardware Asset',
      assetCode: `IIA-AST-${Math.floor(4000 + Math.random() * 1000)}`,
      category: assetData.category || 'Computers',
      purchaseDate: assetData.purchaseDate || new Date().toISOString().split('T')[0],
      purchasePrice: Number(assetData.purchasePrice) || 25000,
      vendor: assetData.vendor || 'Campus Vendor',
      status: 'Available',
    };
    set({ assets: [newAsset, ...get().assets] });
    get().logActivity(`Added asset: ${newAsset.name} (${newAsset.assetCode})`, 'Inventory');
  },

  // Module 9: Notice Actions
  addNotice: (noticeData) => {
    const newNotice = {
      _id: `ntc-${Date.now()}`,
      title: noticeData.title || 'Official Announcement',
      content: noticeData.content || 'Notice details',
      category: noticeData.category || 'General',
      priority: noticeData.priority || 'Normal',
      isPinned: noticeData.isPinned || false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    set({ notices: [newNotice, ...get().notices] });
    get().logActivity(`Published notice: ${newNotice.title}`, 'Notices');
  },

  // Module 10: Chat Actions
  sendChatMessage: (recipientId, text) => {
    const newMsg = {
      _id: `msg-${Date.now()}`,
      senderName: get().currentUser.name,
      senderRole: get().currentUser.role,
      recipientId,
      text,
      createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    set({ chatMessages: [...get().chatMessages, newMsg] });
  },

  // Module 11: Leave Actions
  requestLeave: (leaveData) => {
    const newLeave = {
      _id: `lv-${Date.now()}`,
      applicantId: get().currentUser.id,
      applicantName: get().currentUser.name,
      applicantRole: get().currentUser.role,
      leaveType: leaveData.leaveType || 'Casual',
      startDate: leaveData.startDate || new Date().toISOString().split('T')[0],
      endDate: leaveData.endDate || new Date().toISOString().split('T')[0],
      reason: leaveData.reason || 'Personal work',
      substituteTeacher: leaveData.substituteTeacher || 'Prof. Johann Weber',
      status: 'Pending',
    };
    set({ leaveRequests: [newLeave, ...get().leaveRequests] });
    get().logActivity(`Requested ${newLeave.leaveType} leave`, 'Leaves');
  },

  approveLeave: (leaveId, isApproved) => {
    const newStatus = isApproved ? 'Approved' : 'Rejected';
    set({
      leaveRequests: get().leaveRequests.map((l) => (l._id === leaveId ? { ...l, status: newStatus } : l)),
    });
    get().logActivity(`Leave request ${newStatus} for ID ${leaveId}`, 'Leaves');
  },

  // State Helpers
  setTheme: (theme) => set({ theme }),
  setActiveRole: (role) => {
    localStorage.setItem('elh_user_role', role);
    set({ activeRole: role, currentUser: { ...get().currentUser, role } });
  },
  toggleAiDrawer: () => set({ isAiDrawerOpen: !get().isAiDrawerOpen }),
  // Live MongoDB API Sync Action
  fetchInitialData: async () => {
    try {
      const token = localStorage.getItem('elh_auth_token');
      const headers = { Authorization: `Bearer ${token || 'demo-token'}` };

      const endpoints = [
        { key: 'leads', url: '/api/leads' },
        { key: 'students', url: '/api/students' },
        { key: 'courses', url: '/api/courses' },
        { key: 'batches', url: '/api/batches' },
        { key: 'fees', url: '/api/fees' },
        { key: 'expenses', url: '/api/expenses' },
        { key: 'attendanceLogs', url: '/api/attendance' },
        { key: 'books', url: '/api/library/books' },
        { key: 'homeworks', url: '/api/homework' },
        { key: 'scholarships', url: '/api/scholarships' },
        { key: 'ptms', url: '/api/ptm' },
        { key: 'exams', url: '/api/exams' },
        { key: 'notices', url: '/api/notices' },
        { key: 'leaveRequests', url: '/api/leaves' },
      ];

      for (const ep of endpoints) {
        try {
          const res = await fetch(ep.url, { headers });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              set({ [ep.key]: data });
            }
          }
        } catch (_) {
          // Ignore individual endpoint offline errors
        }
      }
    } catch (err) {
      console.warn('MongoDB API sync notice:', err.message);
    }
  },

  logActivity: (action, module) => {
    const newLog = {
      _id: `log-${Date.now()}`,
      userName: get().currentUser.name,
      userRole: get().currentUser.role,
      action,
      module,
      timestamp: new Date().toLocaleString('en-IN'),
    };
    set({ auditLogs: [newLog, ...get().auditLogs.slice(0, 99)] });
  },
}));

