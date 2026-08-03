export type UserRole = 'Admin' | 'Counsellor' | 'Teacher' | 'Student';

export interface CustomRole {
  id: string;
  name: string;
  parentRole: UserRole;
  rank: number;
  description: string;
  createdBy: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  customRoleTitle?: string;
  isActive: boolean;
  avatarUrl?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Demo' | 'Follow-up' | 'Admission' | 'Lost';
export type Language = 'German' | 'French' | 'Spanish' | 'Italian' | 'Portuguese' | 'English';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface LeadNote {
  text: string;
  by: string;
  at: string;
}

export interface Lead {
  _id: string;
  name: string;
  parentName?: string;
  aadhaarNo?: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  course: string;
  gradeApplied?: string;
  language: Language;
  level: CEFRLevel;
  source: string;
  quotedFee: number;
  busRequired?: string;
  previousPercentage?: string;
  counsellorId?: string;
  counsellorName?: string;
  status: LeadStatus;
  notes: LeadNote[];
  nextFollowUpAt?: string;
  lastConversation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentDoc {
  type: string;
  url: string;
  status: 'Pending' | 'Submitted' | 'Verified';
}

export interface Student {
  _id: string;
  studentId: string;
  name: string;
  parentName?: string;
  aadhaarNo?: string;
  dob?: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  guardianName?: string;
  emergencyContact?: string;
  courseName: string;
  gradeApplied?: string;
  level: string;
  batchCode?: string;
  busRequired?: string;
  joiningDate: string;
  admissionDate: string;
  documents: StudentDoc[];
  referralSource?: string;
  isActive: boolean;
  photoUrl?: string;
}

export interface CourseLevel {
  code: CEFRLevel;
  durationWeeks: number;
  totalClasses: number;
  baseFee: number;
  syllabusOverview?: string;
}

export interface Course {
  _id: string;
  name: string;
  code: string;
  description?: string;
  levels: CourseLevel[];
  isActive: boolean;
}

export interface Batch {
  _id: string;
  code: string;
  courseName: string;
  level: string;
  teacherName?: string;
  room: string;
  days: string[];
  timing: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  currentEnrolledCount: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface FeeInstallment {
  installmentNo: number;
  amount: number;
  dueDate: string;
  paidAmount: number;
  paidDate?: string;
  mode?: 'Cash' | 'UPI' | 'Bank Transfer' | 'Card';
  transactionRef?: string;
  receiptUrl?: string;
  status: 'Pending' | 'Paid' | 'Overdue';
}

export interface FeeRecord {
  _id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  courseName: string;
  totalFee: number;
  discount: number;
  netFee: number;
  paidTotal: number;
  remainingTotal: number;
  installments: FeeInstallment[];
  status: 'Pending' | 'Partial' | 'Paid' | 'Overdue';
}

export interface Expense {
  _id: string;
  category: 'Rent' | 'Salary' | 'Electricity' | 'Internet' | 'Marketing' | 'Stationery' | 'Maintenance' | 'Other';
  amount: number;
  date: string;
  paidBy: string;
  remarks?: string;
}

export interface Certificate {
  _id: string;
  certNumber: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  courseName: string;
  level: string;
  grade: string;
  scorePercentage: number;
  issueDate: string;
  qrUrl?: string;
}
