import { create } from 'zustand';

// Single Master Admin / Owner Account
const initialRegisteredUsers = [
  {
    id: 'usr-admin',
    name: 'Dinesha & Niresh',
    email: 'admin@elh.edu',
    phone: '+91 98765 43210',
    password: 'password123',
    role: 'Admin',
    designation: 'Institute Owners & Directors',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
];

export const useAppStore = create((set, get) => ({
  isAuthenticated: !!localStorage.getItem('elh_auth_token'),
  theme: 'dark',
  activeRole: localStorage.getItem('elh_user_role') || 'Admin',
  currentUser: {
    ...initialRegisteredUsers[0],
    role: localStorage.getItem('elh_user_role') || 'Admin',
    name: localStorage.getItem('elh_user_name') || 'Dinesha & Niresh',
  },
  isAiDrawerOpen: false,

  // User Roster & Roles
  users: initialRegisteredUsers,
  customRoles: [],

  // Core CRM & Student Arrays
  leads: [],
  students: [],
  courses: [],
  batches: [],
  fees: [],
  expenses: [],
  certificates: [],

  // Academic & School Modules
  schoolClasses: [],
  subjects: [],
  academicYears: [],
  academicSessions: [],
  attendanceLogs: [],
  timetableSlots: [],
  teacherAttendanceLogs: [],
  studyNotes: [],

  // Resource & Extension Arrays
  books: [],
  bookIssues: [],
  homeworks: [],
  homeworkSubmissions: [],
  scholarships: [],
  ptms: [],
  exams: [],
  examMarks: [],
  academicEvents: [],
  transportRoutes: [],
  vehicles: [],
  assets: [],
  notices: [],
  chatMessages: [],
  leaveRequests: [],
  auditLogs: [
    {
      _id: 'log-init',
      userName: 'Dinesha & Niresh',
      userRole: 'Admin',
      action: 'System initialized with single Master Owner/Admin account',
      module: 'System',
      timestamp: new Date().toLocaleString('en-IN'),
    },
  ],

  // Auth Actions
  loginUser: (emailOrPhone, passwordAttempt) => {
    const input = emailOrPhone.trim().toLowerCase();
    const user = (get().users || []).find(
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

  // Course & Academics Actions
  addCourse: (courseData) => {
    const newCourse = { _id: `crs-${Date.now()}`, ...courseData };
    set({ courses: [newCourse, ...(get().courses || [])] });
    get().logActivity(`Added course: ${newCourse.name}`, 'Academics');
  },

  addSchoolClass: (classData) => {
    const newClass = { _id: `cls-${Date.now()}`, ...classData };
    set({ schoolClasses: [newClass, ...(get().schoolClasses || [])] });
    get().logActivity(`Added school class: ${newClass.name}`, 'Academics');
  },

  addSubject: (subjectData) => {
    const newSub = { _id: `sbj-${Date.now()}`, ...subjectData };
    set({ subjects: [newSub, ...(get().subjects || [])] });
    get().logActivity(`Added subject: ${newSub.name}`, 'Academics');
  },

  addAcademicYear: (yearData) => {
    const newYr = { _id: `yr-${Date.now()}`, ...yearData };
    set({ academicYears: [newYr, ...(get().academicYears || [])] });
    get().logActivity(`Added academic year: ${newYr.name}`, 'Academics');
  },

  promoteStudents: (fromClassId, toClassId) => {
    get().logActivity(`Promoted students from ${fromClassId} to ${toClassId}`, 'Academics');
  },

  // Batch & Timetable Actions
  addBatch: (batchData) => {
    const newBatch = { _id: `btc-${Date.now()}`, ...batchData };
    set({ batches: [newBatch, ...(get().batches || [])] });
    get().logActivity(`Added batch: ${newBatch.code}`, 'Batches');
  },

  addTimetableSlot: (slotData) => {
    const newSlot = { _id: `ts-${Date.now()}`, ...slotData };
    set({ timetableSlots: [newSlot, ...(get().timetableSlots || [])] });
  },

  saveTeacherAttendance: (logData) => {
    const newLog = { _id: `ta-${Date.now()}`, ...logData };
    set({ teacherAttendanceLogs: [newLog, ...(get().teacherAttendanceLogs || [])] });
  },

  // Attendance Actions
  saveDailyAttendanceLog: (attData) => {
    const newLog = { _id: `att-${Date.now()}`, ...attData };
    set({ attendanceLogs: [newLog, ...(get().attendanceLogs || [])] });
    get().logActivity(`Recorded daily attendance for ${newLog.date}`, 'Attendance');
  },

  // Exams Actions
  addExam: (examData) => {
    const newExam = {
      _id: `ex-${Date.now()}`,
      title: examData.title,
      examType: examData.examType || 'Mid Term',
      session: '2026-27',
      batchCode: examData.batchCode,
      subject: examData.subject,
      examDate: examData.examDate,
      startTime: examData.startTime || '09:00 AM',
      room: examData.room || 'Main Hall',
      invigilatorName: examData.invigilatorName || get().currentUser.name,
      totalMarks: Number(examData.totalMarks) || 100,
      passingMarks: Number(examData.passingMarks) || 50,
    };
    set({ exams: [newExam, ...(get().exams || [])] });
    get().logActivity(`Created exam: ${newExam.title}`, 'Exams');
  },

  recordExamMarks: (markData) => {
    const newMark = {
      _id: `em-${Date.now()}`,
      examId: markData.examId,
      studentId: markData.studentId,
      studentCode: markData.studentCode,
      studentName: markData.studentName,
      marksObtained: Number(markData.marksObtained),
      grade: markData.marksObtained >= 90 ? 'A+' : markData.marksObtained >= 75 ? 'A' : 'B',
      rank: 1,
      teacherRemarks: markData.teacherRemarks || '',
    };
    set({ examMarks: [newMark, ...(get().examMarks || [])] });
    get().logActivity(`Recorded exam mark for ${newMark.studentName}`, 'Exams');
  },

  // Academic Calendar Actions
  addAcademicEvent: (eventData) => {
    const newEvt = {
      _id: `evt-${Date.now()}`,
      title: eventData.title,
      eventType: eventData.eventType || 'Class Events',
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      targetRoles: eventData.targetRoles || ['All'],
      description: eventData.description || '',
    };
    set({ academicEvents: [newEvt, ...(get().academicEvents || [])] });
    get().logActivity(`Created academic event: ${newEvt.title}`, 'Calendar');
  },

  // Study Notes Action
  addStudyNote: (noteData) => {
    const newNote = { _id: `note-${Date.now()}`, ...noteData };
    set({ studyNotes: [newNote, ...(get().studyNotes || [])] });
  },

  // Transport & Asset Actions
  addTransportRoute: (routeData) => {
    const newRoute = { _id: `rt-${Date.now()}`, ...routeData };
    set({ transportRoutes: [newRoute, ...(get().transportRoutes || [])] });
  },

  addAsset: (assetData) => {
    const newAsset = { _id: `ast-${Date.now()}`, ...assetData };
    set({ assets: [newAsset, ...(get().assets || [])] });
  },

  // Notice & Chat & Leave Actions
  addNotice: (noticeData) => {
    const newNotice = { _id: `ntc-${Date.now()}`, ...noticeData };
    set({ notices: [newNotice, ...(get().notices || [])] });
  },

  sendChatMessage: (recipientId, text) => {
    const newMsg = {
      _id: `msg-${Date.now()}`,
      senderName: get().currentUser.name,
      senderRole: get().currentUser.role,
      recipientId,
      text,
      createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    set({ chatMessages: [...(get().chatMessages || []), newMsg] });
  },

  requestLeave: (leaveData) => {
    const newLeave = { _id: `lv-${Date.now()}`, ...leaveData, status: 'Pending' };
    set({ leaveRequests: [newLeave, ...(get().leaveRequests || [])] });
  },

  approveLeave: (leaveId, isApproved) => {
    const newStatus = isApproved ? 'Approved' : 'Rejected';
    set({
      leaveRequests: (get().leaveRequests || []).map((l) => (l._id === leaveId ? { ...l, status: newStatus } : l)),
    });
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
    set({ auditLogs: [newLog, ...(get().auditLogs || []).slice(0, 99)] });
  },
}));
