import { create } from 'zustand';
import { canManageUser, getCreatableRoles, ROLE_RANKS } from '../utils/hierarchy.js';

// Initial Registered Operational Users Roster
const initialRegisteredUsers = [
  {
    id: 'usr-owner',
    name: 'Amit Sharma (Institute Owner)',
    email: 'owner@schoolerp.com',
    phone: '+91 98110 11223',
    password: 'Owner@123',
    role: 'Owner',
    designation: 'Founder & Chairman',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'usr-counsellor-1',
    name: 'Priya Verma',
    email: 'priya@schoolerp.com',
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
    email: 'rahul@schoolerp.com',
    phone: '+91 99887 76644',
    password: 'Counsellor@123',
    role: 'Counsellor',
    customRoleTitle: 'Admissions Counsellor',
    commissionPercentage: 4,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'usr-teacher-1',
    name: 'Anita Sharma',
    email: 'teacher1@schoolerp.com',
    phone: '+91 97654 32101',
    password: 'Teacher@123',
    role: 'Teacher',
    customRoleTitle: 'Head of Mathematics Faculty',
    salaryAmount: 65000,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
  },
  {
    id: 'usr-teacher-2',
    name: 'Vikas Kumar',
    email: 'teacher2@schoolerp.com',
    phone: '+91 97654 32102',
    password: 'Teacher@123',
    role: 'Teacher',
    customRoleTitle: 'Head of Science Faculty',
    salaryAmount: 67500,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'usr-teacher-3',
    name: 'Sneha Gupta',
    email: 'teacher3@schoolerp.com',
    phone: '+91 97654 32103',
    password: 'Teacher@123',
    role: 'Teacher',
    customRoleTitle: 'Head of English Faculty',
    salaryAmount: 70000,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
  {
    id: 'usr-teacher-4',
    name: 'Rohit Sharma',
    email: 'teacher4@schoolerp.com',
    phone: '+91 97654 32104',
    password: 'Teacher@123',
    role: 'Teacher',
    customRoleTitle: 'Head of Computer Science Faculty',
    salaryAmount: 72500,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  },
  {
    id: 'usr-teacher-5',
    name: 'Neha Verma',
    email: 'teacher5@schoolerp.com',
    phone: '+91 97654 32105',
    password: 'Teacher@123',
    role: 'Teacher',
    customRoleTitle: 'Head of Social Science Faculty',
    salaryAmount: 75000,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
  },
];

const initialCustomRoles = [
  { id: 'role-c1', name: 'Head Admissions Counsellor', parentRole: 'Counsellor', rank: 2, description: 'Senior counsellor', createdBy: 'Vikramaditya Roy' },
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
    course: 'German Language',
    language: 'German',
    level: 'A1',
    quotedFee: 25000,
    source: 'Walk-in',
    status: 'Contacted',
    notes: [{ text: 'Expressed interest in weekend batch', by: 'Priya Nair', at: new Date().toISOString() }],
    callHistory: [{ durationSeconds: 180, notes: 'Discussed schedule', outcome: 'Interested', date: new Date().toISOString() }],
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
    course: 'French Language',
    language: 'French',
    level: 'A1',
    quotedFee: 28000,
    source: 'Google Ads',
    status: 'Interested',
    notes: [{ text: 'Requested demo class', by: 'Priya Nair', at: new Date().toISOString() }],
    callHistory: [],
    createdAt: new Date().toISOString(),
  },
];

const initialStudents = [
  { _id: 'std-1', studentId: 'IIA-1001', name: 'Aarav Gupta', parentName: 'Ramesh Gupta', dob: '2004-05-14', phone: '+91 91234 56789', email: 'student@elh.edu', courseName: 'German', level: 'A1', batchCode: 'GER-A1-B01', joiningDate: '2026-07-01', isActive: true },
];

const initialSubjects = [
  { _id: 'sb-1', code: 'ENG-101', name: 'English Literature & Language', teacherName: 'Anjali Saxena', weeklyClasses: 5, maxMarks: 100, passingMarks: 33, isPractical: false },
  { _id: 'sb-2', code: 'MATH-201', name: 'Mathematics & Analytics', teacherName: 'Dr. Rajesh Sharma', weeklyClasses: 6, maxMarks: 100, passingMarks: 33, isPractical: false },
  { _id: 'sb-3', code: 'SCI-301', name: 'General Science & Physics', teacherName: 'Prof. Amit Kulkarni', weeklyClasses: 5, maxMarks: 100, passingMarks: 33, isPractical: true },
  { _id: 'sb-4', code: 'PHY-401', name: 'Senior Physics & Laboratory', teacherName: 'Prof. Amit Kulkarni', weeklyClasses: 6, maxMarks: 100, passingMarks: 33, isPractical: true },
  { _id: 'sb-5', code: 'CHEM-402', name: 'Senior Chemistry & Organic Lab', teacherName: 'Prof. Johann Weber', weeklyClasses: 6, maxMarks: 100, passingMarks: 33, isPractical: true },
  { _id: 'sb-6', code: 'BIO-403', name: 'Biology & Life Sciences', teacherName: 'Sunita Menon', weeklyClasses: 5, maxMarks: 100, passingMarks: 33, isPractical: true },
  { _id: 'sb-7', code: 'CS-501', name: 'Computer Science & AI Coding', teacherName: 'Vikramaditya Roy', weeklyClasses: 5, maxMarks: 100, passingMarks: 33, isPractical: true },
  { _id: 'sb-8', code: 'GER-101', name: 'German Language (CEFR A1-C2)', teacherName: 'Prof. Amit Kulkarni', weeklyClasses: 5, maxMarks: 100, passingMarks: 50, isPractical: false },
  { _id: 'sb-9', code: 'FRE-101', name: 'French Language (DELF A1-B2)', teacherName: 'Prof. Johann Weber', weeklyClasses: 5, maxMarks: 100, passingMarks: 50, isPractical: false },
  { _id: 'sb-10', code: 'ACC-601', name: 'Accountancy & Financial Management', teacherName: 'Siddharth Roy', weeklyClasses: 6, maxMarks: 100, passingMarks: 33, isPractical: false },
];

const initialAcademicYears = [
  { _id: 'ay-1', code: '2026-27', name: 'Academic Session 2026-2027', startDate: '2026-04-01', endDate: '2027-03-31', isCurrent: true, status: 'Active' },
  { _id: 'ay-2', code: '2027-28', name: 'Academic Session 2027-2028', startDate: '2027-04-01', endDate: '2028-03-31', isCurrent: false, status: 'Upcoming' },
];

const initialSchoolClasses = [
  { _id: 'cls-pp1', name: 'Nursery / Play Group', code: 'NUR', category: 'Pre-Primary', programType: 'School_K12', sections: [{ code: 'Section A', teacherName: 'Priya Nair', capacity: 25 }], baseFee: 18000 },
  { _id: 'cls-pp2', name: 'LKG (Lower Kindergarten)', code: 'LKG', category: 'Pre-Primary', programType: 'School_K12', sections: [{ code: 'Section A', teacherName: 'Anjali Saxena', capacity: 25 }], baseFee: 20000 },
  { _id: 'cls-pp3', name: 'UKG (Upper Kindergarten)', code: 'UKG', category: 'Pre-Primary', programType: 'School_K12', sections: [{ code: 'Section A', teacherName: 'Anjali Saxena', capacity: 25 }], baseFee: 22000 },
  { _id: 'cls-p1', name: 'Class 1', code: 'STD-01', category: 'Primary', programType: 'School_K12', sections: [{ code: 'Section A', teacherName: 'Prof. Amit Kulkarni', capacity: 35 }, { code: 'Section B', teacherName: 'Priya Nair', capacity: 35 }], baseFee: 28000 },
  { _id: 'cls-p5', name: 'Class 5', code: 'STD-05', category: 'Primary', programType: 'School_K12', sections: [{ code: 'Section A', teacherName: 'Dr. Rajesh Sharma', capacity: 35 }], baseFee: 32000 },
  { _id: 'cls-m8', name: 'Class 8', code: 'STD-08', category: 'Middle', programType: 'School_K12', sections: [{ code: 'Section A', teacherName: 'Prof. Johann Weber', capacity: 40 }], baseFee: 36000 },
  { _id: 'cls-s10', name: 'Class 10 (Secondary Board)', code: 'STD-10', category: 'Secondary', programType: 'School_K12', sections: [{ code: 'Section A', teacherName: 'Dr. Rajesh Sharma', capacity: 40 }], baseFee: 42000 },
  { _id: 'cls-ss11', name: 'Class 11 (Senior Secondary)', code: 'STD-11', category: 'Senior Secondary', programType: 'School_K12', streams: [
    { name: 'Science Stream', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'], fee: 48000 },
    { name: 'Commerce Stream', subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics'], fee: 44000 },
    { name: 'Arts / Humanities Stream', subjects: ['History', 'Geography', 'Political Science', 'English'], fee: 40000 },
  ], sections: [{ code: 'Section A (Science)', teacherName: 'Prof. Amit Kulkarni', capacity: 40 }], baseFee: 48000 },
  { _id: 'cls-ss12', name: 'Class 12 (Board Final)', code: 'STD-12', category: 'Senior Secondary', programType: 'School_K12', streams: [
    { name: 'Science Stream', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'], fee: 52000 },
    { name: 'Commerce Stream', subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics'], fee: 48000 },
  ], sections: [{ code: 'Section A (Science)', teacherName: 'Dr. Rajesh Sharma', capacity: 40 }], baseFee: 52000 },
];

const initialCourses = [
  {
    _id: 'crs-1',
    name: 'German Language',
    code: 'GER',
    description: 'Comprehensive Goethe-Institut aligned German language course from A1 to C2.',
    programType: 'Language_Coaching',
    category: 'Language_Coaching',
    levels: [
      { code: 'A1', baseFee: 25000, durationWeeks: 8, totalClasses: 40 },
      { code: 'A2', baseFee: 28000, durationWeeks: 8, totalClasses: 40 },
      { code: 'B1', baseFee: 32000, durationWeeks: 10, totalClasses: 50 },
    ],
  },
  {
    _id: 'crs-2',
    name: 'French Language',
    code: 'FRE',
    description: 'DELF/DALF certified French language curriculum covering all levels.',
    programType: 'Language_Coaching',
    category: 'Language_Coaching',
    levels: [
      { code: 'A1', baseFee: 26000, durationWeeks: 8, totalClasses: 40 },
      { code: 'A2', baseFee: 29000, durationWeeks: 8, totalClasses: 40 },
    ],
  },
];

const initialBatches = [
  {
    _id: 'btc-1',
    code: 'GER-A1-B01',
    courseName: 'German',
    level: 'A1',
    teacherName: 'Prof. Amit Kulkarni',
    room: 'Aryabhata Hall (Room 102)',
    timing: '09:00 AM - 11:00 AM',
    days: ['Mon', 'Wed', 'Fri'],
    maxStudents: 15,
    currentStudents: 1,
    status: 'Ongoing',
    startDate: '2026-07-01',
  },
  {
    _id: 'btc-2',
    code: 'FRE-A1-B01',
    courseName: 'French',
    level: 'A1',
    teacherName: 'Prof. Johann Weber',
    room: 'Chanakya Hall (Room 104)',
    timing: '11:30 AM - 01:30 PM',
    days: ['Tue', 'Thu', 'Sat'],
    maxStudents: 20,
    currentStudents: 0,
    status: 'Upcoming',
    startDate: '2026-08-15',
  },
];

const initialFees = [
  { _id: 'fee-1', studentId: 'std-1', studentCode: 'IIA-1001', studentName: 'Aarav Gupta', courseName: 'German A1', totalFee: 25000, discount: 2500, netFee: 22500, paidTotal: 15000, remainingTotal: 7500, status: 'Partial', installments: [{ installmentNo: 1, amount: 15000, paidAmount: 15000, status: 'Paid', payMode: 'UPI', refText: 'GPay-99281' }] },
];

const initialExpenses = [
  { _id: 'exp-1', title: 'Facility Rent & Maintenance', category: 'Rent', amount: 45000, date: '2026-08-01', remarks: 'Monthly lease payment' },
];

const initialCertificates = [
  {
    _id: 'cert-1',
    certNumber: 'IIA-CERT-2026-1001',
    studentId: 'std-1',
    studentName: 'Aarav Gupta',
    courseName: 'German Language',
    level: 'A1',
    grade: 'Distinction (A+)',
    marks: 94,
    issueDate: '2026-08-01',
    qrCodeUrl: '/verify/IIA-CERT-2026-1001',
  },
];

const initialBooks = [
  { _id: 'bk-1', title: 'Netzwerk A1 Deutsch', author: 'Stefanie Dengler', category: 'German Language', isbn: '978-3126061285', barcode: 'IIA-BK-9001', shelf: 'Shelf A', rack: 'Rack 02', purchasePrice: 1850, status: 'Issued' },
];

const initialBookIssues = [
  { _id: 'iss-1', bookId: 'bk-1', bookTitle: 'Netzwerk A1 Deutsch', barcode: 'IIA-BK-9001', borrowerName: 'Aarav Gupta', borrowerRole: 'Student', issueDate: '2026-08-01', dueDate: '2026-08-15', returnDate: null, fineAmount: 0 },
];

const initialHomeworks = [
  { _id: 'hw-1', title: 'German A1 Chapter 2 Grammar', description: 'Exercises on nominative cases', batchCode: 'GER-A1-B01', teacherName: 'Prof. Amit Kulkarni', dueDate: '2026-08-10', totalMarks: 50 },
];

const initialHomeworkSubmissions = [
  { _id: 'sub-1', homeworkId: 'hw-1', studentCode: 'IIA-1001', studentName: 'Aarav Gupta', submissionDate: '2026-08-06', fileUrl: '/docs/aarav_hw1.pdf', status: 'Evaluated', marksObtained: 46, teacherRemarks: 'Great work!' },
];

const initialScholarships = [
  { _id: 'sch-1', studentCode: 'IIA-1001', studentName: 'Aarav Gupta', type: 'Sibling Discount', percentage: 10, amount: 2500, reason: 'Younger sibling enrolled', status: 'Approved', approvedBy: 'Vikramaditya Roy' },
];

const initialPTMs = [
  { _id: 'ptm-1', teacherName: 'Prof. Amit Kulkarni', studentCode: 'IIA-1001', studentName: 'Aarav Gupta', parentName: 'Ramesh Gupta', parentPhone: '+91 93344 55667', meetingDate: '2026-08-12', meetingTime: '04:00 PM', meetingType: 'Online', meetLink: 'https://meet.google.com/iia-ptm', status: 'Upcoming' },
];

const initialExams = [
  { _id: 'ex-1', title: 'Goethe German A1 Mid-Term Examination', examType: 'Mid Term', session: '2026-27', batchCode: 'GER-A1-B01', subject: 'German Syntax & Oral', examDate: '2026-08-15', startTime: '09:00 AM', room: 'Aryabhata Hall (Room 102)', invigilatorName: 'Prof. Amit Kulkarni', totalMarks: 100, passingMarks: 50 },
];

const initialExamMarks = [
  { _id: 'em-1', examId: 'ex-1', studentId: 'std-1', studentCode: 'IIA-1001', studentName: 'Aarav Gupta', marksObtained: 94, grade: 'A+', rank: 1, teacherRemarks: 'Outstanding listening and grammar accuracy.' },
];

const initialAcademicEvents = [
  { _id: 'evt-1', title: 'Independence Day School Celebration & Flag Hoisting', eventType: 'Annual Function', startDate: '2026-08-15', endDate: '2026-08-15', targetRoles: ['All'], description: 'Institute Flag Hoisting ceremony followed by cultural program.' },
  { _id: 'evt-2', title: 'Goethe German A1 Examination Week', eventType: 'Exam', startDate: '2026-08-15', endDate: '2026-08-20', targetRoles: ['Student', 'Teacher'], description: 'Mid-term examinations across all language levels.' },
];

const initialTransportRoutes = [
  { _id: 'rt-1', routeCode: 'R-101', routeName: 'Indiranagar - Koramangala - Campus', stops: [{ stopName: 'Indiranagar Metro', pickupTime: '07:30 AM', fee: 2500 }, { stopName: 'Koramangala 5th Block', pickupTime: '07:50 AM', fee: 2200 }], vehicleNo: 'KA-01-EQ-9988', driverName: 'Sardar Singh', driverPhone: '+91 98877 66554' },
];

const initialVehicles = [
  { _id: 'vh-1', vehicleNo: 'KA-01-EQ-9988', model: 'Tata Starbus 40 Seater', capacity: 40, driverName: 'Sardar Singh', insuranceExpiry: '2027-03-31', fitnessExpiry: '2027-05-15', status: 'Active' },
];

const initialAssets = [
  { _id: 'ast-1', name: 'Epson EB-E01 3300 Lumens Projector', assetCode: 'IIA-AST-4001', category: 'Projectors', purchaseDate: '2026-02-10', purchasePrice: 38500, vendor: 'ProTech Electronics', status: 'Available', room: 'Aryabhata Hall (Room 102)' },
  { _id: 'ast-2', name: 'Dell OptiPlex 7090 Desktop Computer', assetCode: 'IIA-AST-4002', category: 'Computers', purchaseDate: '2026-01-15', purchasePrice: 65000, vendor: 'Dell Direct', status: 'Issued', assignedTo: 'Prof. Amit Kulkarni' },
];

const initialNotices = [
  { _id: 'ntc-1', title: 'CBSE Mid-Term Examination Schedule Announcement', content: 'Detailed timetable for German A1 & B1 exams published.', category: 'General', priority: 'High', isPinned: true, createdAt: '2026-08-05' },
];

const initialChatMessages = [
  { _id: 'msg-1', senderName: 'Dr. Rajesh Sharma', senderRole: 'Admin', recipientId: 'usr-teacher', text: 'Please upload the A1 mid-term question paper PDF.', createdAt: '2026-08-06 10:15 AM' },
];

const initialLeaveRequests = [
  { _id: 'lv-1', applicantId: 'usr-teacher', applicantName: 'Prof. Amit Kulkarni', applicantRole: 'Teacher', leaveType: 'Casual', startDate: '2026-08-20', endDate: '2026-08-21', reason: 'Family function', substituteTeacher: 'Prof. Johann Weber', status: 'Pending' },
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

