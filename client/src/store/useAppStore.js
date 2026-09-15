import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { socket, joinRoleChannel } from '../services/socket';

const isRenderCloud = typeof window !== 'undefined' && (window.location.hostname.includes('render.com') || window.location.hostname.includes('onrender.com'));
export const API_BASE = import.meta.env.VITE_API_URL || (isRenderCloud ? 'https://crm-ed2t.onrender.com' : '');

// Single Master Owner / Admin Account
const initialRegisteredUsers = [
  {
    id: 'usr-admin',
    name: 'Director',
    email: 'admin@elh.edu',
    phone: '+91 98765 43210',
    password: 'password123',
    role: 'Admin',
    designation: 'Director',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
];

// Default Active Courses & Batches for clean setup
const defaultCourses = [
  { _id: 'crs-ger', code: 'GER', name: 'German Language Program', description: 'Goethe & CEFR German A1-B2' },
  { _id: 'crs-fre', code: 'FRE', name: 'French Language Program', description: 'DELF A1-B2' },
  { _id: 'crs-eng', code: 'ENG', name: 'Business English & Public Speaking', description: 'Professional Communication' },
];

const defaultBatches = [
  {
    _id: 'btc-101',
    code: 'GER-A1-B01',
    courseName: 'German',
    level: 'A1',
    teacherName: 'Prof. Amit Kulkarni',
    room: 'Aryabhata Hall (Room 102)',
    days: ['Mon', 'Wed', 'Fri'],
    timing: '09:00 AM - 11:00 AM',
    status: 'Ongoing',
    currentEnrolledCount: 12,
    maxStudents: 15,
  },
  {
    _id: 'btc-102',
    code: 'FRE-A1-B01',
    courseName: 'French',
    level: 'A1',
    teacherName: 'Prof. Amit Kulkarni',
    room: 'Room 103',
    days: ['Tue', 'Thu', 'Sat'],
    timing: '11:30 AM - 01:30 PM',
    status: 'Ongoing',
    currentEnrolledCount: 10,
    maxStudents: 15,
  },
  {
    _id: 'btc-103',
    code: 'ENG-B1-B01',
    courseName: 'English',
    level: 'B1',
    teacherName: 'Prof. Amit Kulkarni',
    room: 'Room 104',
    days: ['Mon', 'Tue', 'Thu'],
    timing: '03:00 PM - 05:00 PM',
    status: 'Ongoing',
    currentEnrolledCount: 14,
    maxStudents: 20,
  },
];

export const useAppStore = create(
  persist(
    (set, get) => ({
  isAuthenticated: !!localStorage.getItem('elh_auth_token'),
  theme: 'dark',
  activeRole: localStorage.getItem('elh_user_role') || 'Admin',
  currentUser: {
    ...initialRegisteredUsers[0],
    role: localStorage.getItem('elh_user_role') || 'Admin',
    name: (!localStorage.getItem('elh_user_name') || localStorage.getItem('elh_user_name') === 'Dinesha & Niresh') ? 'Director' : localStorage.getItem('elh_user_name'),
  },
  isAiDrawerOpen: false,

  // User Roster & Roles
  users: initialRegisteredUsers,
  customRoles: [],

  // Core CRM & Student Arrays
  leads: [],
  students: [],
  courses: defaultCourses,
  batches: defaultBatches,
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
      userName: 'Director',
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
  fetchLeads: async () => {
    try {
      const token = localStorage.getItem('elh_auth_token');
      const res = await fetch(`${API_BASE}/api/leads`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const serverLeads = await res.json();
        if (Array.isArray(serverLeads) && serverLeads.length > 0) {
          const currentLeads = get().leads || [];
          const currentMap = new Map(currentLeads.map((l) => [l._id, l]));
          serverLeads.forEach((sl) => {
            const existing = currentMap.get(sl._id);
            currentMap.set(sl._id, { ...sl, ...(existing || {}) });
          });
          set({ leads: Array.from(currentMap.values()) });
        }
      }
    } catch (err) {
      // Offline fallback to persisted storage
    }
  },

  addLead: async (leadData) => {
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
      callHistory: [],
      followUps: [],
    };
    set({ leads: [newLead, ...(get().leads || [])] });
    get().logActivity(`Created new lead inquiry: ${newLead.name}`, 'CRM');

    try {
      const token = localStorage.getItem('elh_auth_token');
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newLead),
      });
      const data = await res.json();
      if (data && data._id) {
        set({
          leads: (get().leads || []).map((l) => (l._id === newLead._id ? { ...l, ...data } : l)),
        });
      }
    } catch (err) {
      console.warn('Backend sync warning for lead creation (using local store):', err.message);
    }
  },

  updateLeadStatus: async (leadId, newStatus) => {
    const prevLead = (get().leads || []).find((l) => l._id === leadId);
    const historyEntry = {
      fromStatus: prevLead?.status || 'New',
      toStatus: newStatus,
      changedBy: get().currentUser.name,
      changedAt: new Date(),
    };
    set({
      leads: (get().leads || []).map((l) =>
        l._id === leadId
          ? {
              ...l,
              status: newStatus,
              statusHistory: [historyEntry, ...(l.statusHistory || [])],
            }
          : l
      ),
    });
    get().logActivity(`Updated lead status to ${newStatus} for ID ${leadId}`, 'CRM');

    try {
      const token = localStorage.getItem('elh_auth_token');
      await fetch(`${API_BASE}/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn('Backend sync warning for lead status (using local store):', err.message);
    }
  },

  addLeadNote: (leadId, text) => {
    const newNote = { text, by: get().currentUser.name, at: new Date() };
    set({
      leads: (get().leads || []).map((l) =>
        l._id === leadId ? { ...l, notes: [newNote, ...(l.notes || [])] } : l
      ),
    });
  },

  addCallHistory: async (leadId, callData) => {
    const newCall = {
      ...callData,
      id: `call-${Date.now()}`,
      by: get().currentUser.name,
      calledBy: get().currentUser.name,
      at: new Date(),
      calledAt: new Date(),
    };

    let targetStatus = undefined;
    if (callData.outcome === 'Interested') {
      targetStatus = 'Interested';
    } else if (callData.outcome === 'Not Interested') {
      targetStatus = 'Not Interested';
    }

    set({
      leads: (get().leads || []).map((l) =>
        l._id === leadId
          ? {
              ...l,
              status: targetStatus || (l.status === 'New' ? 'Contacted' : l.status),
              calls: [newCall, ...(l.calls || [])],
              callHistory: [newCall, ...(l.callHistory || [])],
              followUps: [
                {
                  date: new Date(),
                  outcome: callData.outcome || 'Interested',
                  notes: callData.notes || '',
                  nextFollowUpDate: callData.nextFollowUpDate,
                  loggedBy: get().currentUser.name,
                },
                ...(l.followUps || []),
              ],
              nextFollowUpDate: callData.nextFollowUpDate || l.nextFollowUpDate,
              nextFollowUpAt: callData.nextFollowUpDate || l.nextFollowUpAt,
            }
          : l
      ),
    });

    get().logActivity(`Logged follow-up (${callData.outcome}) for lead ID ${leadId}`, 'CRM');

    try {
      const token = localStorage.getItem('elh_auth_token');
      await fetch(`${API_BASE}/api/leads/${leadId}/follow-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(callData),
      });
    } catch (err) {
      console.warn('Backend sync warning for follow-up (using local store):', err.message);
    }
  },

  convertLeadToStudent: (leadId, targetBatchCode = 'GER-A1-B01') => {
    const lead = (get().leads || []).find((l) => l._id === leadId);
    if (!lead) return { success: false, message: 'Lead not found.' };

    const batch = (get().batches || []).find((b) => b.code === targetBatchCode) || (get().batches || [])[0];
    if (batch && (batch.currentEnrolledCount || 0) >= (batch.maxStudents || 15)) {
      return {
        success: false,
        message: `Batch Capacity Full! Batch ${batch.code} already has ${batch.currentEnrolledCount}/${batch.maxStudents} students enrolled.`,
      };
    }

    const studentCode = `TELA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudent = {
      _id: `std-${Date.now()}`,
      studentId: studentCode,
      name: lead.name,
      parentName: lead.parentName || 'Guardian',
      phone: lead.phone,
      whatsapp: lead.whatsapp || lead.phone,
      email: lead.email,
      courseName: lead.course || lead.language || 'German',
      language: lead.language || 'German',
      level: lead.level || 'A1',
      batchCode: batch ? batch.code : 'GER-A1-B01',
      city: lead.city || 'Kaithal',
      aadhaarNo: lead.aadhaarNo || '',
      joiningDate: new Date(),
      isActive: true,
      verificationStatus: 'Verified',
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          type: 'Aadhaar / ID Proof',
          name: `${lead.name.replace(/\s+/g, '_')}_Aadhaar_Verified.pdf`,
          status: 'Verified',
          uploadedAt: new Date().toISOString(),
          fileSize: '1.2 MB',
        },
        {
          id: `doc-${Date.now()}-2`,
          type: 'Academic Transcript',
          name: `${lead.name.replace(/\s+/g, '_')}_Transcript_Marksheet.pdf`,
          status: 'Verified',
          uploadedAt: new Date().toISOString(),
          fileSize: '2.4 MB',
        },
      ],
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
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          paidAmount: 0,
          status: 'Pending',
        },
        {
          installmentNo: 2,
          amount: (lead.quotedFee || 25000) / 2,
          dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          paidAmount: 0,
          status: 'Pending',
        },
      ],
    };

    // Increment batch enrolled count
    const updatedBatches = (get().batches || []).map((b) =>
      b.code === (batch ? batch.code : '')
        ? { ...b, currentEnrolledCount: (b.currentEnrolledCount || 0) + 1 }
        : b
    );

    const historyEntry = {
      fromStatus: lead.status,
      toStatus: 'Converted',
      changedBy: get().currentUser.name,
      changedAt: new Date(),
      reason: `Enrolled as ${studentCode} in batch ${batch ? batch.code : 'GER-A1-B01'}`,
    };

    set({
      leads: (get().leads || []).map((l) =>
        l._id === leadId
          ? {
              ...l,
              status: 'Converted',
              convertedStudentId: newStudent._id,
              statusHistory: [historyEntry, ...(l.statusHistory || [])],
            }
          : l
      ),
      students: [newStudent, ...(get().students || [])],
      batches: updatedBatches,
      fees: [newFee, ...(get().fees || [])],
    });
    get().logActivity(`Converted lead ${lead.name} to Student (${studentCode})`, 'Admissions');
    return { success: true, student: newStudent, batch: batch || updatedBatches[0] };
  },

  assignStudentBatch: (studentId, newBatchCode) => {
    const targetBatch = (get().batches || []).find((b) => b.code === newBatchCode);
    if (!targetBatch) {
      return { success: false, message: `Batch ${newBatchCode} not found.` };
    }

    if ((targetBatch.currentEnrolledCount || 0) >= (targetBatch.maxStudents || 15)) {
      return {
        success: false,
        message: `Capacity Full! Cannot assign to ${targetBatch.code}. Maximum ${targetBatch.maxStudents} seats already reached (${targetBatch.currentEnrolledCount}/${targetBatch.maxStudents}).`,
      };
    }

    const student = (get().students || []).find((s) => s._id === studentId || s.studentId === studentId);
    if (!student) {
      return { success: false, message: 'Student record not found.' };
    }

    const oldBatchCode = student.batchCode;

    const updatedBatches = (get().batches || []).map((b) => {
      if (b.code === oldBatchCode && b.code !== newBatchCode) {
        return { ...b, currentEnrolledCount: Math.max(0, (b.currentEnrolledCount || 0) - 1) };
      }
      if (b.code === newBatchCode) {
        return { ...b, currentEnrolledCount: (b.currentEnrolledCount || 0) + 1 };
      }
      return b;
    });

    const updatedStudents = (get().students || []).map((s) =>
      s._id === studentId || s.studentId === studentId ? { ...s, batchCode: newBatchCode } : s
    );

    set({ batches: updatedBatches, students: updatedStudents });
    get().logActivity(`Reassigned student ${student.name} from ${oldBatchCode} to ${newBatchCode}`, 'Batches');
    return { success: true, message: `Successfully assigned ${student.name} to ${newBatchCode}!` };
  },

  uploadStudentDocument: (studentId, docData) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      type: docData.type || 'Identity Proof',
      name: docData.name || 'document.pdf',
      status: 'Verified',
      uploadedAt: new Date().toISOString(),
      fileSize: docData.fileSize || '1.5 MB',
    };

    set({
      students: (get().students || []).map((s) =>
        s._id === studentId || s.studentId === studentId
          ? { ...s, documents: [newDoc, ...(s.documents || [])] }
          : s
      ),
    });
    get().logActivity(`Uploaded document (${newDoc.type}) for student ID ${studentId}`, 'Documents');
    return { success: true, document: newDoc };
  },

  // Student Direct Actions
  registerDirectStudent: async (studentData) => {
    const studentCode = studentData.studentId || `TELA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const targetBatch = (get().batches || []).find((b) => b.code === (studentData.batchCode || 'GER-A1-B01'));

    // Duplicate contact number check
    const existingStudent = (get().students || []).find(
      (s) => s.phone === studentData.phone && s.status === 'Active' && !s.isArchived
    );
    if (existingStudent) {
      return {
        success: false,
        message: `Validation Error: Student with contact ${studentData.phone} is already actively enrolled as ${existingStudent.studentId} (${existingStudent.name}).`,
      };
    }

    // Capacity verification
    if (targetBatch && (targetBatch.currentEnrolledCount || 0) >= (targetBatch.maxStudents || 15)) {
      return {
        success: false,
        message: `Batch Capacity Full! Batch ${targetBatch.code} already has ${targetBatch.currentEnrolledCount}/${targetBatch.maxStudents} seats occupied. Please choose an open batch.`,
      };
    }

    const feeNum = Number(studentData.totalFee) || 25000;
    const discountNum = Number(studentData.discount) || 0;
    const netFeeNum = Math.max(0, feeNum - discountNum);

    const newStudent = {
      _id: `std-${Date.now()}`,
      studentId: studentCode,
      batchCode: targetBatch ? targetBatch.code : studentData.batchCode || 'GER-A1-B01',
      batchId: targetBatch ? targetBatch._id : undefined,
      courseName: targetBatch ? targetBatch.courseName : studentData.courseName || 'German',
      level: targetBatch ? targetBatch.level : studentData.level || 'A1',
      status: 'Active',
      isArchived: false,
      isActive: true,
      joiningDate: new Date(),
      admissionDate: new Date(),
      verificationStatus: 'Verified',
      feePlan: studentData.feePlan || 'Full',
      totalFee: feeNum,
      discount: discountNum,
      netFee: netFeeNum,
      paidFee: 0,
      feeBalance: netFeeNum,
      statusHistory: [
        {
          fromStatus: 'None',
          toStatus: 'Active',
          reason: 'Direct Walk-In Admission',
          changedBy: get().currentUser.name || 'Director',
          date: new Date().toISOString(),
        },
      ],
      timeline: [
        {
          title: 'Student Admitted',
          detail: `Enrolled in batch ${targetBatch ? targetBatch.code : 'GER-A1-B01'}. Fee plan: ${studentData.feePlan || 'Full'}.`,
          by: get().currentUser.name || 'Director',
          at: new Date().toLocaleDateString('en-IN'),
        },
      ],
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          type: 'Aadhaar / ID Proof',
          name: `${(studentData.name || 'Student').replace(/\s+/g, '_')}_Aadhaar.pdf`,
          status: 'Verified',
          uploadedAt: new Date().toISOString(),
          fileSize: '1.2 MB',
        },
        {
          id: `doc-${Date.now()}-2`,
          type: 'Academic Transcript',
          name: `${(studentData.name || 'Student').replace(/\s+/g, '_')}_Transcript.pdf`,
          status: 'Verified',
          uploadedAt: new Date().toISOString(),
          fileSize: '2.1 MB',
        },
      ],
      ...studentData,
    };

    const newFee = {
      _id: `fee-${Date.now()}`,
      studentId: newStudent._id,
      studentCode,
      studentName: newStudent.name,
      courseName: newStudent.courseName,
      totalFee: feeNum,
      discount: discountNum,
      netFee: netFeeNum,
      paidTotal: 0,
      remainingTotal: netFeeNum,
      status: 'Unpaid',
      installments:
        studentData.feePlan === 'Installment'
          ? [
              {
                installmentNo: 1,
                amount: Math.round(netFeeNum / 2),
                dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
                paidAmount: 0,
                status: 'Pending',
              },
              {
                installmentNo: 2,
                amount: Math.round(netFeeNum / 2),
                dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                paidAmount: 0,
                status: 'Pending',
              },
            ]
          : [
              {
                installmentNo: 1,
                amount: netFeeNum,
                dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
                paidAmount: 0,
                status: 'Pending',
              },
            ],
    };

    const updatedBatches = (get().batches || []).map((b) =>
      b.code === (targetBatch ? targetBatch.code : '')
        ? { ...b, currentEnrolledCount: (b.currentEnrolledCount || 0) + 1 }
        : b
    );

    set({
      students: [newStudent, ...(get().students || [])],
      batches: updatedBatches,
      fees: [newFee, ...(get().fees || [])],
    });

    // Asynchronously call backend to persist in MongoDB and emit socket events
    try {
      const token = localStorage.getItem('elh_auth_token');
      const res = await fetch(`${API_BASE}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(studentData),
      });
      const data = await res.json();
      if (data.student) {
        set({
          students: (get().students || []).map((s) => (s._id === newStudent._id ? data.student : s)),
        });
      }
    } catch (err) {
      console.warn('Backend admission API warning (using local optimistic state):', err.message);
    }

    get().logActivity(`Registered student ${newStudent.name} (${studentCode})`, 'Students');
    return { success: true, student: newStudent, fee: newFee };
  },

  updateStudentVerificationStatus: (studentId, status) => {
    set({
      students: (get().students || []).map((s) => (s._id === studentId ? { ...s, verificationStatus: status } : s)),
    });
  },

  // Unified Student Status Transition (Graduated, Dropped Out, Fee Defaulter, Inactive, Active)
  changeStudentStatus: async (
    studentId,
    {
      status,
      reason = 'Status updated',
      finalScore = 85,
      grade = 'Pass',
      remarks = '',
      promoteToBatchCode = '',
      issueCertificate = false,
    } = {}
  ) => {
    const student = (get().students || []).find((s) => s._id === studentId || s.studentId === studentId);
    if (!student) return { success: false, message: 'Student record not found.' };

    const oldStatus = student.status;
    const oldBatchCode = student.batchCode;

    let certNumber = null;
    let newCert = null;
    if (status === 'Graduated' && issueCertificate) {
      certNumber = `TELA-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      newCert = {
        _id: `cert-${Date.now()}`,
        certNumber,
        studentId: student._id,
        studentName: student.name,
        studentCode: student.studentId,
        courseName: student.courseName,
        level: student.level || 'A1',
        grade,
        scorePercentage: Number(finalScore) || 85,
        issueDate: new Date(),
        qrUrl: `https://tela.edu.in/verify/${certNumber}`,
      };
    }

    let updatedBatches = get().batches || [];
    // 1. Relieve seat if moving away from Active
    if (oldStatus === 'Active' && status !== 'Active') {
      updatedBatches = updatedBatches.map((b) =>
        b.code === oldBatchCode
          ? { ...b, currentEnrolledCount: Math.max(0, (b.currentEnrolledCount || 0) - 1) }
          : b
      );
    }

    // 2. Increment seat if moving back to Active or Promoted
    if (status === 'Active' || promoteToBatchCode) {
      const targetCode = promoteToBatchCode || student.batchCode;
      const targetBatch = updatedBatches.find((b) => b.code === targetCode);
      if (targetBatch && (targetBatch.currentEnrolledCount || 0) >= (targetBatch.maxStudents || 15)) {
        return {
          success: false,
          message: `Batch Capacity Full! Cannot assign to ${targetCode} (${targetBatch.currentEnrolledCount}/${targetBatch.maxStudents}).`,
        };
      }
      updatedBatches = updatedBatches.map((b) =>
        b.code === targetCode
          ? { ...b, currentEnrolledCount: (b.currentEnrolledCount || 0) + 1 }
          : b
      );
    }

    const auditEntry = {
      fromStatus: oldStatus,
      toStatus: status,
      reason,
      changedBy: get().currentUser.name || 'Director',
      date: new Date().toISOString(),
      finalScore: Number(finalScore) || undefined,
      grade: grade || undefined,
      remarks,
      certificateNo: certNumber || undefined,
    };

    const isNonActive = status !== 'Active';

    const updatedStudent = {
      ...student,
      status,
      isArchived: isNonActive,
      isActive: !isNonActive,
      batchCode: promoteToBatchCode || student.batchCode,
      graduationDate: status === 'Graduated' ? new Date().toISOString().split('T')[0] : student.graduationDate,
      finalGrade: grade || student.finalGrade,
      finalScore: finalScore || student.finalScore,
      certificateNumber: certNumber || student.certificateNumber,
      statusHistory: [auditEntry, ...(student.statusHistory || [])],
      timeline: [
        {
          title: `Status: ${status}`,
          detail: `Reason: ${reason}. Historical records preserved.`,
          by: get().currentUser.name || 'Director',
          at: new Date().toLocaleDateString('en-IN'),
        },
        ...(student.timeline || []),
      ],
    };

    const updatedStudents = (get().students || []).map((s) =>
      s._id === student._id || s.studentId === student.studentId ? updatedStudent : s
    );

    const updatedCertificates = newCert
      ? [newCert, ...(get().certificates || [])]
      : get().certificates || [];

    set({
      students: updatedStudents,
      batches: updatedBatches,
      certificates: updatedCertificates,
    });

    // Call backend API asynchronously
    try {
      const token = localStorage.getItem('elh_auth_token');
      await fetch(`${API_BASE}/api/students/${student._id}/change-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status,
          reason,
          finalScore,
          grade,
          remarks,
          promoteToBatchCode,
          issueCertificate,
        }),
      });
    } catch (err) {
      console.warn('Backend change-status sync warning:', err.message);
    }

    get().logActivity(
      `Status changed to ${status} for student ${student.name} (${student.studentId})`,
      'Students'
    );

    return {
      success: true,
      message: `Status updated to '${status}'. Batch capacity updated and record archived.`,
      student: updatedStudent,
      certificate: newCert,
    };
  },

  graduateStudent: (studentId, options = {}) => {
    return get().changeStudentStatus(studentId, {
      status: 'Graduated',
      reason: options.remarks || 'Course Passed & Graduated',
      ...options,
    });
  },

  reEnrollStudent: (studentId, targetBatchCode) => {
    return get().changeStudentStatus(studentId, {
      status: 'Active',
      promoteToBatchCode: targetBatchCode,
      reason: `Promoted / Re-enrolled to batch ${targetBatchCode}`,
    });
  },

  deleteTestStudent: async (studentId, confirmTestEntry = false) => {
    if (!confirmTestEntry) {
      return {
        success: false,
        message: 'Safety Guard: confirmTestEntry must be true to remove duplicate/test records.',
      };
    }
    const student = (get().students || []).find((s) => s._id === studentId || s.studentId === studentId);
    if (!student) return { success: false, message: 'Student not found.' };

    let updatedBatches = get().batches || [];
    if (student.status === 'Active' && !student.isArchived && student.batchCode) {
      updatedBatches = updatedBatches.map((b) =>
        b.code === student.batchCode
          ? { ...b, currentEnrolledCount: Math.max(0, (b.currentEnrolledCount || 0) - 1) }
          : b
      );
    }

    set({
      students: (get().students || []).filter((s) => s._id !== student._id && s.studentId !== student.studentId),
      batches: updatedBatches,
    });

    try {
      const token = localStorage.getItem('elh_auth_token');
      await fetch(`${API_BASE}/api/students/${student._id}?confirmTestEntry=true`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (err) {
      console.warn('Backend delete sync warning:', err.message);
    }

    get().logActivity(`Removed test student entry ${student.name}`, 'Students');
    return { success: true, message: `Test record for ${student.name} permanently removed.` };
  },

  // Fee Actions
  payInstallment: (feeId, installmentNo, paidAmount, paymentMode, txRef) => {
    const receiptNumber = `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    set({
      fees: (get().fees || []).map((f) => {
        if (f._id !== feeId) return f;
        const updatedInsts = f.installments.map((inst) => {
          if (inst.installmentNo !== installmentNo) return inst;
          return {
            ...inst,
            paidAmount: (inst.paidAmount || 0) + Number(paidAmount),
            mode: paymentMode,
            transactionRef: txRef || `TXN-${receiptNumber}`,
            receiptNumber,
            status: ((inst.paidAmount || 0) + Number(paidAmount)) >= inst.amount ? 'Paid' : 'Partial',
            paidDate: new Date().toISOString().split('T')[0],
          };
        });
        const newPaidTotal = updatedInsts.reduce((sum, i) => sum + (i.paidAmount || 0), 0);
        const newRemaining = Math.max(0, f.netFee - newPaidTotal);
        const newStatus = newRemaining <= 0 ? 'Paid' : newPaidTotal > 0 ? 'Partial' : 'Pending';
        return { ...f, installments: updatedInsts, paidTotal: newPaidTotal, remainingTotal: newRemaining, status: newStatus };
      }),
    });
    get().logActivity(`Processed fee payment for Fee ID ${feeId}`, 'Fees');
    return { success: true, receiptNumber };
  },

  recordManualPayment: (arg1, arg2, arg3, arg4) => {
    let feeId = typeof arg1 === 'string' ? arg1 : null;
    let studentId = typeof arg1 === 'object' ? arg1.studentId : null;
    let studentCode = typeof arg1 === 'object' ? arg1.studentCode : null;
    let amount = typeof arg1 === 'object' ? Number(arg1.amount) : Number(arg2);
    let mode = typeof arg1 === 'object' ? arg1.payMode : arg3 || 'UPI';
    let txRef = typeof arg1 === 'object' ? arg1.refText : arg4 || `TXN-${Date.now()}`;
    const receiptNumber = `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    let targetFee = null;
    if (feeId) {
      targetFee = (get().fees || []).find((f) => f._id === feeId);
    } else if (studentId || studentCode) {
      targetFee = (get().fees || []).find(
        (f) => f.studentId === studentId || f.studentCode === studentCode
      );
    }

    if (!targetFee) {
      // If no fee ledger exists, create one dynamically
      const std = (get().students || []).find(
        (s) => s._id === studentId || s.studentId === studentCode
      );
      targetFee = {
        _id: `fee-${Date.now()}`,
        studentId: std?._id || studentId || `std-${Date.now()}`,
        studentCode: std?.studentId || studentCode || 'TELA-0000',
        studentName: std?.name || arg1.studentName || 'Student',
        courseName: std?.courseName || arg1.courseName || 'German',
        totalFee: 25000,
        discount: 0,
        netFee: 25000,
        paidTotal: 0,
        remainingTotal: 25000,
        status: 'Pending',
        installments: [
          {
            installmentNo: 1,
            amount: 12500,
            dueDate: new Date().toISOString().split('T')[0],
            paidAmount: 0,
            status: 'Pending',
          },
          {
            installmentNo: 2,
            amount: 12500,
            dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            paidAmount: 0,
            status: 'Pending',
          },
        ],
      };
    }

    const newPaidTotal = (targetFee.paidTotal || 0) + amount;
    const newRemaining = Math.max(0, targetFee.netFee - newPaidTotal);
    const newStatus = newRemaining <= 0 ? 'Paid' : newPaidTotal > 0 ? 'Partial' : 'Pending';

    const newInst = {
      installmentNo: (targetFee.installments?.length || 0) + 1,
      amount,
      paidAmount: amount,
      payMode: mode,
      mode,
      refText: txRef,
      transactionRef: txRef,
      receiptNumber,
      paidDate: new Date().toISOString().split('T')[0],
      status: 'Paid',
    };

    const updatedFee = {
      ...targetFee,
      paidTotal: newPaidTotal,
      remainingTotal: newRemaining,
      status: newStatus,
      installments: [...(targetFee.installments || []), newInst],
    };

    const existingIndex = (get().fees || []).findIndex((f) => f._id === targetFee._id);
    let updatedFeesList;
    if (existingIndex >= 0) {
      updatedFeesList = (get().fees || []).map((f) => (f._id === targetFee._id ? updatedFee : f));
    } else {
      updatedFeesList = [updatedFee, ...(get().fees || [])];
    }

    set({ fees: updatedFeesList });
    get().logActivity(`Recorded payment of ₹${amount} with Receipt #${receiptNumber}`, 'Fees');
    return { success: true, fee: updatedFee, inst: newInst, receiptNumber };
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
  saveDailyAttendanceLog: (batchCode, date, entries) => {
    const newLog = {
      _id: `log-${Date.now()}`,
      batchCode,
      date,
      entries,
      markedBy: get().currentUser.name,
      createdAt: new Date(),
    };
    set({
      attendanceLogs: [newLog, ...(get().attendanceLogs || []).filter((l) => !(l.batchCode === batchCode && l.date === date))],
    });
    get().logActivity(`Saved daily attendance log for ${batchCode} on ${date}`, 'Attendance');
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
}),
    {
      name: 'tela_erp_storage',
      onRehydrateStorage: () => (state) => {
        if (state && state.currentUser) {
          if (!state.currentUser.name || state.currentUser.name.includes('Dinesh') || state.currentUser.name.includes('Niresh')) {
            state.currentUser.name = 'Director';
          }
        }
      },
    }
  )
);

// Real-Time Socket.IO Synchronization with Zustand Store
if (typeof window !== 'undefined') {
  socket.on('student:created', (newStudent) => {
    if (!newStudent) return;
    useAppStore.setState((state) => {
      const exists = (state.students || []).some(
        (s) => s._id === newStudent._id || s.studentId === newStudent.studentId
      );
      if (exists) return state;

      const updatedBatches = (state.batches || []).map((b) =>
        b.code === newStudent.batchCode
          ? { ...b, currentEnrolledCount: (b.currentEnrolledCount || 0) + 1 }
          : b
      );

      return {
        students: [newStudent, ...(state.students || [])],
        batches: updatedBatches,
      };
    });
  });

  socket.on('student:status-changed', (payload) => {
    if (!payload || !payload.studentId) return;
    const { studentId, status, student, oldBatchCode, newBatchCode } = payload;
    useAppStore.setState((state) => {
      const updatedStudents = (state.students || []).map((s) => {
        if (s._id === studentId || s.studentId === studentId) {
          return student
            ? { ...s, ...student }
            : {
                ...s,
                status,
                isArchived: status !== 'Active',
                isActive: status === 'Active',
              };
        }
        return s;
      });

      let updatedBatches = state.batches || [];
      if (oldBatchCode && status !== 'Active') {
        updatedBatches = updatedBatches.map((b) =>
          b.code === oldBatchCode
            ? { ...b, currentEnrolledCount: Math.max(0, (b.currentEnrolledCount || 0) - 1) }
            : b
        );
      }
      if (newBatchCode && status === 'Active') {
        updatedBatches = updatedBatches.map((b) =>
          b.code === newBatchCode
            ? { ...b, currentEnrolledCount: (b.currentEnrolledCount || 0) + 1 }
            : b
        );
      }

      return {
        students: updatedStudents,
        batches: updatedBatches,
      };
    });
  });

  socket.on('student:deleted', ({ studentId, studentCode }) => {
    useAppStore.setState((state) => ({
      students: (state.students || []).filter(
        (s) => s._id !== studentId && s.studentId !== studentId && s.studentId !== studentCode
      ),
    }));
  });

  socket.on('batch:seat-updated', ({ batchId, code, currentEnrolledCount }) => {
    useAppStore.setState((state) => ({
      batches: (state.batches || []).map((b) =>
        b._id === batchId || b.code === code
          ? { ...b, currentEnrolledCount }
          : b
      ),
    }));
  });

  socket.on('batch:created', (newBatch) => {
    if (!newBatch) return;
    useAppStore.setState((state) => {
      const exists = (state.batches || []).some((b) => b.code === newBatch.code);
      if (exists) return state;
      return { batches: [newBatch, ...(state.batches || [])] };
    });
  });

  socket.on('fee:payment-received', (payload) => {
    if (!payload || !payload.fee) return;
    const { fee } = payload;
    useAppStore.setState((state) => ({
      fees: (state.fees || []).map((f) => (f._id === fee._id ? fee : f)),
      students: (state.students || []).map((s) =>
        s._id === fee.studentId
          ? { ...s, paidFee: fee.paidTotal, feeBalance: fee.remainingTotal }
          : s
      ),
    }));
  });

  socket.on('fee:invoice-created', (newFee) => {
    if (!newFee) return;
    useAppStore.setState((state) => {
      const exists = (state.fees || []).some((f) => f._id === newFee._id);
      if (exists) return state;
      return { fees: [newFee, ...(state.fees || [])] };
    });
  });

  socket.on('attendance:marked', (log) => {
    if (!log) return;
    useAppStore.setState((state) => {
      const existingIdx = (state.attendanceLogs || []).findIndex(
        (l) => l.batchCode === log.batchCode && l.date === log.date
      );
      if (existingIdx >= 0) {
        const updated = [...state.attendanceLogs];
        updated[existingIdx] = log;
        return { attendanceLogs: updated };
      }
      return { attendanceLogs: [log, ...(state.attendanceLogs || [])] };
    });
  });

  socket.on('lead:stage-changed', ({ leadId, status }) => {
    if (!leadId) return;
    useAppStore.setState((state) => ({
      leads: (state.leads || []).map((l) => (l._id === leadId ? { ...l, status } : l)),
    }));
  });
}
