import { create } from 'zustand';
import { UserRole, CustomRole, User, Lead, Student, Course, Batch, FeeRecord, Expense, Certificate } from '../types';
import { canManageUser, ROLE_RANKS } from '../utils/hierarchy';

interface AppState {
  // Authentication & Theme state
  isAuthenticated: boolean;
  theme: 'dark' | 'light';
  activeRole: UserRole;
  currentUser: User;
  isAiDrawerOpen: boolean;
  
  // Registered User Accounts & Custom Sub-Roles
  users: User[];
  customRoles: CustomRole[];

  // Data entities
  leads: Lead[];
  students: Student[];
  courses: Course[];
  batches: Batch[];
  fees: FeeRecord[];
  expenses: Expense[];
  certificates: Certificate[];

  // Auth Actions
  loginUser: (emailOrPhone: string, passwordAttempt: string) => { success: boolean; message?: string };
  logoutUser: () => void;

  // Hierarchical User & Custom Sub-Role Actions
  addUserAccount: (userData: Partial<User>) => void;
  updateUserAccount: (id: string, updates: Partial<User>) => void;
  deleteUserAccount: (id: string) => void;

  addCustomRole: (roleData: Partial<CustomRole>) => void;
  deleteCustomRole: (id: string) => void;

  // UI Actions
  setTheme: (theme: 'dark' | 'light') => void;
  setActiveRole: (role: UserRole) => void;
  toggleAiDrawer: () => void;
  
  // Lead CRM Actions
  addLead: (leadData: Partial<Lead>) => void;
  updateLeadStatus: (leadId: string, status: Lead['status']) => void;
  addLeadNote: (leadId: string, noteText: string) => void;
  convertLeadToStudent: (leadId: string) => void;
  
  // Fee Actions
  payInstallment: (feeId: string, installmentNo: number, amount: number, mode: string, refText: string) => void;
  
  // Batch & Attendance Actions
  addBatch: (batchData: Partial<Batch>) => void;

  // Expense Actions
  addExpense: (expenseData: Partial<Expense>) => void;

  // Certificate Actions
  generateCertificate: (student: Student, grade: string, score: number) => void;
}

// Initial Registered Staff Accounts Set Up for 4 Roles
const initialRegisteredUsers: User[] = [
  {
    id: 'usr-admin',
    name: 'Dr. Rajesh Sharma (School Admin)',
    email: 'admin@elh.edu',
    phone: '+91 98765 43210',
    password: 'password123',
    role: 'Admin',
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
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
  },
  {
    id: 'usr-student',
    name: 'Aarav Gupta',
    email: 'student@elh.edu',
    phone: '+91 91234 56789',
    password: 'password123',
    role: 'Student',
    isActive: true,
  },
];

const initialCustomRoles: CustomRole[] = [
  {
    id: 'role-c1',
    name: 'Head Admissions Counsellor',
    parentRole: 'Counsellor',
    rank: 2,
    description: 'Senior counsellor overseeing parent enrollment calls & WhatsApp pipeline',
    createdBy: 'Dr. Rajesh Sharma (School Admin)',
  },
  {
    id: 'role-c2',
    name: 'Head of German Faculty',
    parentRole: 'Teacher',
    rank: 3,
    description: 'Lead language instructor managing curriculum & batch attendance',
    createdBy: 'Dr. Rajesh Sharma (School Admin)',
  },
];

const initialLeads: Lead[] = [
  {
    _id: 'lead-1',
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
    counsellorName: 'Priya Nair',
    status: 'New',
    notes: [{ text: 'Inquired about morning intensive batch for Higher Ed', by: 'Priya Nair', at: '2026-08-01T10:30:00Z' }],
    nextFollowUpAt: '2026-08-01T15:00:00Z',
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-01T09:00:00Z',
  },
];

const initialStudents: Student[] = [
  {
    _id: 'std-1',
    studentId: 'IIA-1001',
    name: 'Aarav Gupta',
    dob: '2004-05-14',
    phone: '+91 91234 56789',
    whatsapp: '+91 91234 56789',
    email: 'student@elh.edu',
    address: 'MG Road, Koramangala, Bengaluru',
    courseName: 'German',
    level: 'A1',
    batchCode: 'GER-A1-B01',
    joiningDate: '2026-07-01',
    admissionDate: '2026-07-01',
    documents: [
      { type: 'Aadhaar Card', url: '/docs/aadhaar_aarav.pdf', status: 'Verified' },
    ],
    isActive: true,
  },
];

const initialCourses: Course[] = [
  {
    _id: 'crs-1',
    name: 'German',
    code: 'GER',
    description: 'Comprehensive German language program following Goethe & CEFR guidelines.',
    isActive: true,
    levels: [
      { code: 'A1', durationWeeks: 8, totalClasses: 40, baseFee: 25000, syllabusOverview: 'Basics, Greetings, Daily Routine' },
    ],
  },
];

const initialBatches: Batch[] = [
  {
    _id: 'btc-1',
    code: 'GER-A1-B01',
    courseName: 'German',
    level: 'A1',
    teacherName: 'Prof. Amit Kulkarni',
    room: 'Aryabhata Hall (Room 102)',
    days: ['Mon', 'Wed', 'Fri'],
    timing: '09:00 AM - 11:00 AM',
    startDate: '2026-07-01',
    endDate: '2026-08-25',
    maxStudents: 20,
    currentEnrolledCount: 4,
    status: 'Ongoing',
  },
];

const initialFees: FeeRecord[] = [
  {
    _id: 'fee-1',
    studentId: 'std-1',
    studentCode: 'IIA-1001',
    studentName: 'Aarav Gupta',
    courseName: 'German A1',
    totalFee: 25000,
    discount: 2000,
    netFee: 23000,
    paidTotal: 15000,
    remainingTotal: 8000,
    status: 'Partial',
    installments: [
      {
        installmentNo: 1,
        amount: 15000,
        dueDate: '2026-07-01',
        paidAmount: 15000,
        paidDate: '2026-07-01',
        mode: 'UPI',
        transactionRef: 'GPay-UPI-994182',
        status: 'Paid',
      },
    ],
  },
];

const initialExpenses: Expense[] = [
  { _id: 'exp-1', category: 'Rent', amount: 85000, date: '2026-07-01', paidBy: 'Dr. Rajesh Sharma', remarks: 'Main Campus Facility Rent (Bengaluru)' },
];

const initialCertificates: Certificate[] = [
  {
    _id: 'cert-1',
    certNumber: 'IIA-CERT-2026-1001',
    studentId: 'std-1',
    studentName: 'Aarav Gupta',
    studentCode: 'IIA-1001',
    courseName: 'German Language & Culture',
    level: 'A1',
    grade: 'Distinction',
    scorePercentage: 94,
    issueDate: '2026-07-28',
    qrUrl: 'https://iia.edu.in/verify/IIA-CERT-2026-1001',
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: !!localStorage.getItem('elh_auth_token'),
  theme: 'dark',
  activeRole: (localStorage.getItem('elh_user_role') as UserRole) || 'Admin',
  currentUser: {
    ...initialRegisteredUsers[0],
    role: (localStorage.getItem('elh_user_role') as UserRole) || 'Admin',
    name: localStorage.getItem('elh_user_name') || 'Dr. Rajesh Sharma (School Admin)',
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

  loginUser: (emailOrPhone, passwordAttempt) => {
    const input = emailOrPhone.trim().toLowerCase();
    const user = get().users.find(
      (u) => u.email.toLowerCase() === input || (u.phone && u.phone.includes(input)) || u.id.toLowerCase() === input
    );

    if (!user) {
      return { success: false, message: `No account found matching "${emailOrPhone}". Contact Admin Office.` };
    }

    if (!user.isActive) {
      return { success: false, message: `Account "${user.name}" is deactivated. Contact Admin Office.` };
    }

    if (user.password && user.password !== passwordAttempt) {
      return { success: false, message: 'Invalid password. Please check your credentials.' };
    }

    localStorage.setItem('elh_auth_token', `token-${user.id}-${Date.now()}`);
    localStorage.setItem('elh_user_role', user.role);
    localStorage.setItem('elh_user_name', user.name);

    set({
      isAuthenticated: true,
      activeRole: user.role,
      currentUser: user,
    });

    return { success: true };
  },

  logoutUser: () => {
    localStorage.removeItem('elh_auth_token');
    localStorage.removeItem('elh_user_role');
    localStorage.removeItem('elh_user_name');
    set({ isAuthenticated: false });
  },

  addUserAccount: (userData) => {
    const currentUserRole = get().currentUser.role;
    const targetRole = userData.role || 'Counsellor';

    if (!canManageUser(currentUserRole, targetRole)) {
      alert(`Access Denied: As an ${currentUserRole}, you cannot create a ${targetRole} account.`);
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name || 'New Staff Member',
      email: userData.email || `staff${Date.now()}@elh.edu`,
      phone: userData.phone || '+91 98000 00000',
      password: userData.password || 'password123',
      role: targetRole,
      customRoleTitle: userData.customRoleTitle,
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };
    set({ users: [...get().users, newUser] });
  },

  updateUserAccount: (id, updates) => {
    const targetUser = get().users.find((u) => u.id === id);
    if (!targetUser) return;

    const currentUserRole = get().currentUser.role;

    if (!canManageUser(currentUserRole, targetUser.role)) {
      alert(`Access Denied: As an ${currentUserRole}, you cannot edit a ${targetUser.role} account.`);
      return;
    }

    set({
      users: get().users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    });
  },

  deleteUserAccount: (id) => {
    const targetUser = get().users.find((u) => u.id === id);
    if (!targetUser) return;

    const currentUserRole = get().currentUser.role;

    if (!canManageUser(currentUserRole, targetUser.role)) {
      alert(`Access Denied: As an ${currentUserRole}, you cannot remove a ${targetUser.role} account.`);
      return;
    }

    set({
      users: get().users.filter((u) => u.id !== id),
    });
  },

  addCustomRole: (roleData) => {
    const currentUserRole = get().currentUser.role;
    const parentRole = roleData.parentRole || 'Counsellor';
    const rank = ROLE_RANKS[parentRole] || 2;

    if (!canManageUser(currentUserRole, parentRole)) {
      alert(`Access Denied: You cannot create sub-roles for ${parentRole}.`);
      return;
    }

    const newRole: CustomRole = {
      id: `role-${Date.now()}`,
      name: roleData.name || 'New Custom Sub-Role',
      parentRole: parentRole,
      rank: rank,
      description: roleData.description || 'Custom role created according to hierarchy',
      createdBy: get().currentUser.name,
    };

    set({ customRoles: [...get().customRoles, newRole] });
  },

  deleteCustomRole: (id) => {
    set({ customRoles: get().customRoles.filter((r) => r.id !== id) });
  },

  setTheme: (theme) => {
    set({ theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  setActiveRole: (role) => {
    localStorage.setItem('elh_user_role', role);
    set({
      activeRole: role,
      currentUser: {
        ...get().currentUser,
        role: role,
      },
    });
  },

  toggleAiDrawer: () => set({ isAiDrawerOpen: !get().isAiDrawerOpen }),

  addLead: (leadData) => {
    const newLead: Lead = {
      _id: `lead-${Date.now()}`,
      name: leadData.name || 'New Candidate',
      phone: leadData.phone || '+91 98000 00000',
      whatsapp: leadData.whatsapp || leadData.phone || '+91 98000 00000',
      email: leadData.email || 'candidate@example.com',
      city: leadData.city || 'Bengaluru',
      course: leadData.course || 'German',
      language: (leadData.language as any) || 'German',
      level: (leadData.level as any) || 'A1',
      source: leadData.source || 'Walk-in',
      quotedFee: leadData.quotedFee || 25000,
      counsellorName: get().currentUser.name,
      status: 'New',
      notes: [{ text: 'Lead registered in IIA CRM', by: get().currentUser.name, at: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set({ leads: [newLead, ...get().leads] });
  },

  updateLeadStatus: (leadId, status) => {
    set({
      leads: get().leads.map((l) =>
        l._id === leadId
          ? {
              ...l,
              status,
              updatedAt: new Date().toISOString(),
              notes: [
                ...l.notes,
                { text: `Stage updated to ${status}`, by: get().currentUser.name, at: new Date().toISOString() },
              ],
            }
          : l
      ),
    });
  },

  addLeadNote: (leadId, noteText) => {
    set({
      leads: get().leads.map((l) =>
        l._id === leadId
          ? {
              ...l,
              updatedAt: new Date().toISOString(),
              notes: [...l.notes, { text: noteText, by: get().currentUser.name, at: new Date().toISOString() }],
            }
          : l
      ),
    });
  },

  convertLeadToStudent: (leadId) => {
    const targetLead = get().leads.find((l) => l._id === leadId);
    if (!targetLead) return;

    const newStudentId = `IIA-${1001 + get().students.length}`;
    const newStudent: Student = {
      _id: `std-${Date.now()}`,
      studentId: newStudentId,
      name: targetLead.name,
      phone: targetLead.phone,
      whatsapp: targetLead.whatsapp,
      email: targetLead.email,
      address: `${targetLead.city}, India`,
      courseName: targetLead.course,
      level: targetLead.level,
      joiningDate: new Date().toISOString().split('T')[0],
      admissionDate: new Date().toISOString().split('T')[0],
      documents: [{ type: 'Aadhaar Card', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'Submitted' }],
      isActive: true,
    };

    const newFee: FeeRecord = {
      _id: `fee-${Date.now()}`,
      studentId: newStudent._id,
      studentCode: newStudent.studentId,
      studentName: newStudent.name,
      courseName: `${targetLead.course} ${targetLead.level}`,
      totalFee: targetLead.quotedFee,
      discount: 0,
      netFee: targetLead.quotedFee,
      paidTotal: 0,
      remainingTotal: targetLead.quotedFee,
      status: 'Pending',
      installments: [
        {
          installmentNo: 1,
          amount: targetLead.quotedFee / 2,
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          paidAmount: 0,
          status: 'Pending',
        },
      ],
    };

    set({
      students: [newStudent, ...get().students],
      fees: [newFee, ...get().fees],
      leads: get().leads.map((l) => (l._id === leadId ? { ...l, status: 'Admission' } : l)),
    });
  },

  payInstallment: (feeId, installmentNo, amount, mode, refText) => {
    set({
      fees: get().fees.map((fee) => {
        if (fee._id !== feeId) return fee;

        const updatedInstallments = fee.installments.map((inst) => {
          if (inst.installmentNo !== installmentNo) return inst;
          const newPaid = inst.paidAmount + amount;
          return {
            ...inst,
            paidAmount: newPaid,
            paidDate: new Date().toISOString().split('T')[0],
            mode: mode as any,
            transactionRef: refText || `GPay-UPI-${Math.floor(100000 + Math.random() * 900000)}`,
            status: (newPaid >= inst.amount ? 'Paid' : 'Pending') as any,
          };
        });

        const paidTotal = updatedInstallments.reduce((sum, i) => sum + i.paidAmount, 0);
        const remainingTotal = fee.netFee - paidTotal;
        const status = remainingTotal <= 0 ? 'Paid' : paidTotal > 0 ? 'Partial' : 'Pending';

        return {
          ...fee,
          installments: updatedInstallments,
          paidTotal,
          remainingTotal,
          status,
        };
      }),
    });
  },

  addBatch: (batchData) => {
    const newBatch: Batch = {
      _id: `btc-${Date.now()}`,
      code: batchData.code || 'GER-A1-NEW',
      courseName: batchData.courseName || 'German',
      level: batchData.level || 'A1',
      teacherName: batchData.teacherName || 'Prof. Amit Kulkarni',
      room: batchData.room || 'Aryabhata Hall (Room 101)',
      days: batchData.days || ['Mon', 'Wed'],
      timing: batchData.timing || '10:00 AM - 12:00 PM',
      startDate: batchData.startDate || new Date().toISOString().split('T')[0],
      endDate: batchData.endDate || new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      maxStudents: batchData.maxStudents || 20,
      currentEnrolledCount: 0,
      status: 'Ongoing',
    };
    set({ batches: [newBatch, ...get().batches] });
  },

  addExpense: (expenseData) => {
    const newExpense: Expense = {
      _id: `exp-${Date.now()}`,
      category: expenseData.category || 'Other',
      amount: expenseData.amount || 10000,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      paidBy: get().currentUser.name,
      remarks: expenseData.remarks || 'General operating expense',
    };
    set({ expenses: [newExpense, ...get().expenses] });
  },

  generateCertificate: (student, grade, score) => {
    const newCert: Certificate = {
      _id: `cert-${Date.now()}`,
      certNumber: `IIA-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: student._id,
      studentName: student.name,
      studentCode: student.studentId,
      courseName: `${student.courseName} Mastery`,
      level: student.level,
      grade: grade || 'Distinction',
      scorePercentage: score || 94,
      issueDate: new Date().toISOString().split('T')[0],
      qrUrl: `https://iia.edu.in/verify/IIA-CERT-2026-${student.studentId}`,
    };
    set({ certificates: [newCert, ...get().certificates] });
  },
}));
