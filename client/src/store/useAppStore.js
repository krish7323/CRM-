import { create } from 'zustand';

// Single Master Owner / Admin Account
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

  // CRM Lead Actions
  addLead: (leadData) => {
    const newLead = {
      _id: `ld-${Date.now()}`,
      name: leadData.name || 'New Applicant',
      parentName: leadData.parentName || '',
      aadhaarNo: leadData.aadhaarNo || '',
      phone: leadData.phone || '',
      whatsapp: leadData.whatsapp || leadData.phone || '',
      email: leadData.email || '',
      course: leadData.course || 'German',
      language: leadData.language || leadData.course || 'German',
      level: leadData.level || 'A1',
      quotedFee: Number(leadData.quotedFee) || 25000,
      source: leadData.source || 'Walk-in',
      city: leadData.city || 'Kaithal',
      status: 'New',
      counsellorName: get().currentUser.name,
      createdAt: new Date(),
      notes: [],
      calls: [],
    };
    set({ leads: [newLead, ...(get().leads || [])] });
    get().logActivity(`Created new lead inquiry: ${newLead.name}`, 'CRM');
  },

  updateLeadStatus: (leadId, newStatus) => {
    set({
      leads: (get().leads || []).map((l) => (l._id === leadId ? { ...l, status: newStatus } : l)),
    });
    get().logActivity(`Updated lead status to ${newStatus} for ID ${leadId}`, 'CRM');
  },

  addLeadNote: (leadId, text) => {
    const newNote = { text, by: get().currentUser.name, at: new Date() };
    set({
      leads: (get().leads || []).map((l) =>
        l._id === leadId ? { ...l, notes: [newNote, ...(l.notes || [])] } : l
      ),
    });
  },

  addCallHistory: (leadId, callData) => {
    const newCall = { ...callData, by: get().currentUser.name, at: new Date() };
    set({
      leads: (get().leads || []).map((l) =>
        l._id === leadId ? { ...l, calls: [newCall, ...(l.calls || [])] } : l
      ),
    });
  },

  convertLeadToStudent: (leadId) => {
    const lead = (get().leads || []).find((l) => l._id === leadId);
    if (!lead) return;

    const studentCode = `IIA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudent = {
      _id: `std-${Date.now()}`,
      studentId: studentCode,
      name: lead.name,
      parentName: lead.parentName || 'N/A',
      phone: lead.phone,
      whatsapp: lead.whatsapp || lead.phone,
      email: lead.email,
      courseName: lead.course || 'German',
      level: lead.level || 'A1',
      batchCode: `${(lead.course || 'GER').substring(0, 3).toUpperCase()}-A1-B01`,
      joiningDate: new Date(),
      isActive: true,
      verificationStatus: 'Verified',
    };

    const newFee = {
      _id: `fee-${Date.now()}`,
      studentId: newStudent._id,
      studentCode,
      studentName: newStudent.name,
      courseName: newStudent.courseName,
      totalFee: lead.quotedFee || 25000,
      discount: 0,
      netFee: lead.quotedFee || 25000,
      paidTotal: 0,
      remainingTotal: lead.quotedFee || 25000,
      status: 'Unpaid',
      installments: [
        {
          installmentNo: 1,
          amount: (lead.quotedFee || 25000) / 2,
          dueDate: new Date(Date.now() + 7 * 86400000),
          paidAmount: 0,
          status: 'Pending',
        },
        {
          installmentNo: 2,
          amount: (lead.quotedFee || 25000) / 2,
          dueDate: new Date(Date.now() + 30 * 86400000),
          paidAmount: 0,
          status: 'Pending',
        },
      ],
    };

    set({
      leads: (get().leads || []).map((l) => (l._id === leadId ? { ...l, status: 'Admission' } : l)),
      students: [newStudent, ...(get().students || [])],
      fees: [newFee, ...(get().fees || [])],
    });
    get().logActivity(`Converted lead ${lead.name} to Student (${studentCode})`, 'Admissions');
  },

  // Student Direct Actions
  registerDirectStudent: (studentData) => {
    const studentCode = `IIA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudent = {
      _id: `std-${Date.now()}`,
      studentId: studentCode,
      ...studentData,
      joiningDate: new Date(),
      isActive: true,
      verificationStatus: 'Verified',
    };
    set({ students: [newStudent, ...(get().students || [])] });
    get().logActivity(`Registered student ${newStudent.name} (${studentCode})`, 'Students');
  },

  updateStudentVerificationStatus: (studentId, status) => {
    set({
      students: (get().students || []).map((s) => (s._id === studentId ? { ...s, verificationStatus: status } : s)),
    });
  },

  // Fee Actions
  payInstallment: (feeId, installmentNo, paidAmount, paymentMode, txRef) => {
    set({
      fees: (get().fees || []).map((f) => {
        if (f._id !== feeId) return f;
        const updatedInsts = f.installments.map((inst) => {
          if (inst.installmentNo !== installmentNo) return inst;
          return { ...inst, paidAmount, mode: paymentMode, transactionRef: txRef, status: 'Paid', paidDate: new Date() };
        });
        const newPaidTotal = updatedInsts.reduce((sum, i) => sum + (i.paidAmount || 0), 0);
        const newRemaining = f.netFee - newPaidTotal;
        const newStatus = newRemaining <= 0 ? 'Paid' : newPaidTotal > 0 ? 'Partial' : 'Unpaid';
        return { ...f, installments: updatedInsts, paidTotal: newPaidTotal, remainingTotal: newRemaining, status: newStatus };
      }),
    });
    get().logActivity(`Processed fee payment for Fee ID ${feeId}`, 'Fees');
  },

  recordManualPayment: (feeId, amount, mode, txRef) => {
    set({
      fees: (get().fees || []).map((f) => {
        if (f._id !== feeId) return f;
        const newPaidTotal = f.paidTotal + Number(amount);
        const newRemaining = Math.max(0, f.netFee - newPaidTotal);
        const newStatus = newRemaining <= 0 ? 'Paid' : 'Partial';
        return { ...f, paidTotal: newPaidTotal, remainingTotal: newRemaining, status: newStatus };
      }),
    });
  },

  updateFeeNote: (feeId, note) => {
    set({
      fees: (get().fees || []).map((f) => (f._id === feeId ? { ...f, internalNotes: note } : f)),
    });
  },

  updateFeeDueDate: (feeId, installmentNo, newDueDate) => {
    set({
      fees: (get().fees || []).map((f) => {
        if (f._id !== feeId) return f;
        const updatedInsts = f.installments.map((inst) =>
          inst.installmentNo === installmentNo ? { ...inst, dueDate: newDueDate } : inst
        );
        return { ...f, installments: updatedInsts };
      }),
    });
  },

  // Expense Actions
  addExpense: (expenseData) => {
    const newExp = { _id: `exp-${Date.now()}`, ...expenseData, date: new Date() };
    set({ expenses: [newExp, ...(get().expenses || [])] });
    get().logActivity(`Recorded expense: ₹${newExp.amount} (${newExp.category})`, 'Expenses');
  },

  // Certificate Actions
  generateCertificate: (certData) => {
    const certNumber = `IIA-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert = {
      _id: `cert-${Date.now()}`,
      certNumber,
      studentName: certData.studentName,
      courseName: certData.courseName || 'German Language',
      issueDate: new Date(),
      qrUrl: `https://iia.edu.in/verify/${certNumber}`,
      ...certData,
    };
    set({ certificates: [newCert, ...(get().certificates || [])] });
    get().logActivity(`Generated certificate ${certNumber} for ${newCert.studentName}`, 'Certificates');
  },

  // User Administration Actions
  addUserAccount: (userData) => {
    const newUser = { id: `usr-${Date.now()}`, isActive: true, ...userData };
    set({ users: [...(get().users || []), newUser] });
    get().logActivity(`Created user account: ${newUser.name} (${newUser.role})`, 'Administration');
  },

  updateUserAccount: (userId, userData) => {
    set({
      users: (get().users || []).map((u) => (u.id === userId ? { ...u, ...userData } : u)),
    });
  },

  deleteUserAccount: (userId) => {
    set({
      users: (get().users || []).filter((u) => u.id !== userId),
    });
  },

  addCustomRole: (roleData) => {
    set({ customRoles: [...(get().customRoles || []), roleData] });
  },

  deleteCustomRole: (roleName) => {
    set({ customRoles: (get().customRoles || []).filter((r) => r.name !== roleName) });
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

  // PTM & Scholarship Actions
  schedulePTM: (ptmData) => {
    const newPtm = { _id: `ptm-${Date.now()}`, ...ptmData, status: 'Scheduled' };
    set({ ptms: [newPtm, ...(get().ptms || [])] });
    get().logActivity(`Scheduled PTM with ${newPtm.parentName || 'Parent'}`, 'PTM');
  },

  updatePTMStatus: (ptmId, status) => {
    set({ ptms: (get().ptms || []).map((p) => (p._id === ptmId ? { ...p, status } : p)) });
  },

  requestScholarship: (schData) => {
    const newSch = { _id: `sch-${Date.now()}`, ...schData, status: 'Pending' };
    set({ scholarships: [newSch, ...(get().scholarships || [])] });
    get().logActivity(`Requested scholarship for ${newSch.studentName}`, 'Scholarships');
  },

  approveScholarship: (schId, isApproved) => {
    const newStatus = isApproved ? 'Approved' : 'Rejected';
    set({ scholarships: (get().scholarships || []).map((s) => (s._id === schId ? { ...s, status: newStatus } : s)) });
    get().logActivity(`Scholarship ${newStatus} for ID ${schId}`, 'Scholarships');
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

  // Homework Actions
  addHomework: (hwData) => {
    const newHw = { _id: `hw-${Date.now()}`, ...hwData, createdAt: new Date() };
    set({ homeworks: [newHw, ...(get().homeworks || [])] });
    get().logActivity(`Created homework assignment: ${newHw.title}`, 'Homework');
  },

  submitHomework: (subData) => {
    const newSub = { _id: `sub-${Date.now()}`, ...subData, submittedAt: new Date(), status: 'Submitted' };
    set({ homeworkSubmissions: [newSub, ...(get().homeworkSubmissions || [])] });
  },

  gradeHomework: (subId, grade, remarks) => {
    set({
      homeworkSubmissions: (get().homeworkSubmissions || []).map((s) =>
        s._id === subId ? { ...s, grade, remarks, status: 'Graded' } : s
      ),
    });
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
