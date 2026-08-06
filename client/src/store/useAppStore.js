import { create } from 'zustand';
import { canManageUser, ROLE_RANKS } from '../utils/hierarchy.js';

// Initial Registered Users Roster (10 Roles)
const initialRegisteredUsers = [
  {
    id: 'usr-owner',
    name: 'Vikramaditya Roy (Institute Owner)',
    email: 'owner@elh.edu',
    phone: '+91 99999 88888',
    password: 'password123',
    role: 'Owner',
    designation: 'Managing Director & Founder',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'usr-admin',
    name: 'Dr. Rajesh Sharma (School Admin)',
    email: 'admin@elh.edu',
    phone: '+91 98765 43210',
    password: 'password123',
    role: 'Admin',
    designation: 'Chief Academic Officer',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'usr-counsellor',
    name: 'Priya Nair',
    email: 'counsellor@elh.edu',
    phone: '+91 99887 76655',
    password: 'password123',
    role: 'Counsellor',
    customRoleTitle: 'Head Admissions Counsellor',
    commissionPercentage: 5,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  },
  {
    id: 'usr-teacher',
    name: 'Prof. Amit Kulkarni',
    email: 'teacher@elh.edu',
    phone: '+91 97654 32109',
    password: 'password123',
    role: 'Teacher',
    customRoleTitle: 'Head of German Faculty',
    salaryAmount: 65000,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
  },
  {
    id: 'usr-accountant',
    name: 'Siddharth Roy',
    email: 'accountant@elh.edu',
    phone: '+91 91122 33445',
    password: 'password123',
    role: 'Accountant',
    customRoleTitle: 'Chief Financial Officer',
    salaryAmount: 55000,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'usr-librarian',
    name: 'Sunita Menon',
    email: 'librarian@elh.edu',
    phone: '+91 92233 44556',
    password: 'password123',
    role: 'Librarian',
    customRoleTitle: 'Chief Knowledge Resource Officer',
    salaryAmount: 48000,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
  {
    id: 'usr-transport',
    name: 'Harpreet Singh',
    email: 'transport@elh.edu',
    phone: '+91 94455 66778',
    password: 'password123',
    role: 'Transport Manager',
    customRoleTitle: 'Head of Fleet Operations',
    salaryAmount: 45000,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  },
  {
    id: 'usr-hr',
    name: 'Anjali Saxena',
    email: 'hr@elh.edu',
    phone: '+91 95566 77889',
    password: 'password123',
    role: 'HR',
    customRoleTitle: 'Head of Human Resources',
    salaryAmount: 52000,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
  },
  {
    id: 'usr-parent',
    name: 'Ramesh Gupta (Parent)',
    email: 'parent@elh.edu',
    phone: '+91 93344 55667',
    password: 'password123',
    role: 'Parent',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
  {
    id: 'usr-student',
    name: 'Aarav Gupta',
    email: 'student@elh.edu',
    phone: '+91 91234 56789',
    password: 'password123',
    role: 'Student',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  },
];

const initialCustomRoles = [
  { id: 'role-c1', name: 'Head Admissions Counsellor', parentRole: 'Counsellor', rank: 2, description: 'Senior counsellor', createdBy: 'Vikramaditya Roy' },
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

// New Module Initial Data
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

const initialStudents = [
  { _id: 'std-1', studentId: 'IIA-1001', name: 'Aarav Gupta', parentName: 'Ramesh Gupta', dob: '2004-05-14', phone: '+91 91234 56789', email: 'student@elh.edu', courseName: 'German', level: 'A1', batchCode: 'GER-A1-B01', joiningDate: '2026-07-01', isActive: true },
];

const initialFees = [
  { _id: 'fee-1', studentId: 'std-1', studentCode: 'IIA-1001', studentName: 'Aarav Gupta', courseName: 'German A1', totalFee: 25000, discount: 2500, netFee: 22500, paidTotal: 15000, remainingTotal: 7500, status: 'Partial', installments: [{ installmentNo: 1, amount: 15000, paidAmount: 15000, status: 'Paid' }] },
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
  leads: [],
  students: initialStudents,
  courses: [],
  batches: [],
  fees: initialFees,
  expenses: [],
  certificates: [],
  books: initialBooks,
  bookIssues: initialBookIssues,
  homeworks: initialHomeworks,
  homeworkSubmissions: initialHomeworkSubmissions,
  scholarships: initialScholarships,
  ptms: initialPTMs,

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
