import { create } from 'zustand';
import { canManageUser, ROLE_RANKS } from '../utils/hierarchy.js';

// Single Master Admin User Roster
const initialRegisteredUsers = [
  {
    id: 'usr-admin',
    name: 'Master ERP Administrator',
    email: 'admin@elh.edu',
    phone: '+91 98765 43210',
    password: 'password123',
    role: 'Admin',
    designation: 'System Administrator & Principal',
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
    name: localStorage.getItem('elh_user_name') || 'Master ERP Administrator',
  },
  isAiDrawerOpen: false,

  users: initialRegisteredUsers,
  customRoles: [],
  leads: [],
  students: [],
  courses: [],
  batches: [],
  fees: [],
  expenses: [],
  certificates: [],
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
      userName: 'Master ERP Administrator',
      userRole: 'Admin',
      action: 'System initialized with single Master Admin account',
      module: 'System',
      timestamp: new Date().toLocaleString('en-IN'),
    },
  ],

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
    set({ exams: [newExam, ...get().exams] });
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
    set({ examMarks: [newMark, ...get().examMarks] });
    get().logActivity(`Recorded exam mark for ${newMark.studentName}`, 'Exams');
  },

  // Module 6: Academic Calendar Actions
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
    set({ academicEvents: [newEvt, ...get().academicEvents] });
    get().logActivity(`Created academic event: ${newEvt.title}`, 'Calendar');
  },

  // Module 7: Transport Actions
  addTransportRoute: (routeData) => {
    const newRoute = {
      _id: `rt-${Date.now()}`,
      routeCode: routeData.routeCode,
      routeName: routeData.routeName,
      stops: routeData.stops || [],
      vehicleNo: routeData.vehicleNo || '',
      driverName: routeData.driverName || '',
    };
    set({ transportRoutes: [newRoute, ...get().transportRoutes] });
    get().logActivity(`Added transport route: ${newRoute.routeName}`, 'Transport');
  },

  // Module 8: Inventory Asset Actions
  addAsset: (assetData) => {
    const newAsset = {
      _id: `ast-${Date.now()}`,
      name: assetData.name,
      assetCode: `IIA-AST-${Math.floor(4000 + Math.random() * 1000)}`,
      category: assetData.category || 'Computers',
      purchaseDate: assetData.purchaseDate || new Date().toISOString().split('T')[0],
      purchasePrice: Number(assetData.purchasePrice) || 0,
      vendor: assetData.vendor || '',
      status: 'Available',
    };
    set({ assets: [newAsset, ...get().assets] });
    get().logActivity(`Added asset: ${newAsset.name} (${newAsset.assetCode})`, 'Inventory');
  },

  // Module 9: Notice Actions
  addNotice: (noticeData) => {
    const newNotice = {
      _id: `ntc-${Date.now()}`,
      title: noticeData.title,
      content: noticeData.content,
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
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      reason: leaveData.reason,
      substituteTeacher: leaveData.substituteTeacher || '',
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
