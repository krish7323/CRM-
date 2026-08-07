import express from 'express';
import mongoose from 'mongoose';
import { authenticateJWT } from '../middleware/auth.js';
import { requireRoles } from '../middleware/rbac.js';
import User from '../models/User.js';
import Lead from '../models/Lead.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import Batch from '../models/Batch.js';
import Attendance from '../models/Attendance.js';
import Fee from '../models/Fee.js';
import Expense from '../models/Expense.js';
import Certificate from '../models/Certificate.js';
import Message from '../models/Message.js';
import Book from '../models/Book.js';
import BookIssue from '../models/BookIssue.js';
import Homework from '../models/Homework.js';
import HomeworkSubmission from '../models/HomeworkSubmission.js';
import Scholarship from '../models/Scholarship.js';
import PTM from '../models/PTM.js';
import Exam from '../models/Exam.js';
import ExamMark from '../models/ExamMark.js';
import AcademicEvent from '../models/AcademicEvent.js';
import TransportRoute from '../models/TransportRoute.js';
import Vehicle from '../models/Vehicle.js';
import Asset from '../models/Asset.js';
import Notice from '../models/Notice.js';
import ChatMessage from '../models/ChatMessage.js';
import LeaveRequest from '../models/LeaveRequest.js';

const router = express.Router();

/* All routes require active JWT authentication */
router.use(authenticateJWT);

const isDbConnected = () => mongoose.connection.readyState === 1;

// Fallback datasets for Standalone API mode when MongoDB is offline
const fallbackLeads = [{ _id: 'ld-1', name: 'Rohan Verma', phone: '+91 98765 43210', course: 'German', level: 'A1', status: 'New' }];
const fallbackStudents = [{ _id: 'std-1', studentId: 'IIA-1001', name: 'Aarav Gupta', courseName: 'German', level: 'A1' }];
const fallbackBooks = [{ _id: 'bk-1', title: 'Netzwerk A1 Deutsch', barcode: 'IIA-BK-9001', status: 'Available' }];
const fallbackHomeworks = [{ _id: 'hw-1', title: 'German A1 Chapter 2', batchCode: 'GER-A1-B01' }];
const fallbackScholarships = [{ _id: 'sch-1', studentCode: 'IIA-1001', type: 'Sibling Discount', amount: 2500, status: 'Approved' }];
const fallbackPTMs = [{ _id: 'ptm-1', studentCode: 'IIA-1001', teacherName: 'Prof. Amit Kulkarni', status: 'Upcoming' }];
const fallbackExams = [{ _id: 'ex-1', title: 'Goethe German A1 Mid-Term', examType: 'Mid Term', totalMarks: 100 }];
const fallbackEvents = [{ _id: 'evt-1', title: 'Independence Day Celebration', eventType: 'Annual Function' }];
const fallbackRoutes = [{ _id: 'rt-1', routeCode: 'R-101', routeName: 'Indiranagar - Campus', driverName: 'Sardar Singh' }];
const fallbackAssets = [{ _id: 'ast-1', name: 'Epson EB-E01 Projector', assetCode: 'IIA-AST-4001', status: 'Available' }];
const fallbackNotices = [{ _id: 'ntc-1', title: 'CBSE Mid-Term Exam Schedule', category: 'General', priority: 'High' }];
const fallbackMessages = [{ _id: 'msg-1', senderName: 'Dr. Rajesh Sharma', text: 'Mid-term question paper uploaded.' }];
const fallbackLeaves = [{ _id: 'lv-1', applicantName: 'Prof. Amit Kulkarni', leaveType: 'Casual', status: 'Pending' }];
const fallbackCourses = [{ _id: 'crs-1', name: 'German Language', code: 'GER-A1' }];
const fallbackBatches = [{ _id: 'btc-1', code: 'GER-A1-B01', courseName: 'German A1' }];
const fallbackAttendance = [{ _id: 'att-1', batchCode: 'GER-A1-B01', presentCount: 18 }];
const fallbackFees = [{ _id: 'fee-1', studentCode: 'IIA-1001', netFee: 22500, paidTotal: 15000, remainingTotal: 7500 }];
const fallbackExpenses = [{ _id: 'exp-1', title: 'Facility Rent', amount: 45000 }];

/* ==================== USER MANAGEMENT ==================== */
router.get('/users', requireRoles(['Owner', 'Admin', 'HR']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json([]);
    const users = await User.find({ isDeleted: false }).select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.json([]);
  }
});

router.post('/users', requireRoles(['Owner', 'Admin', 'HR']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ id: `usr-${Date.now()}`, ...req.body });
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/users/:id', requireRoles(['Owner', 'Admin', 'HR']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json({ id: req.params.id, ...req.body });
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/users/:id', requireRoles(['Owner', 'Admin']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json({ success: true });
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true, isActive: false });
    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== CRM LEADS ==================== */
router.get('/leads', requireRoles(['Owner', 'Admin', 'Counsellor']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackLeads);
    const leads = await Lead.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.json(fallbackLeads);
  }
});

router.post('/leads', requireRoles(['Owner', 'Admin', 'Counsellor']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `ld-${Date.now()}`, ...req.body });
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/leads/:id', requireRoles(['Owner', 'Admin', 'Counsellor']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json({ _id: req.params.id, ...req.body });
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== STUDENTS ==================== */
router.get('/students', requireRoles(['Owner', 'Admin', 'Counsellor', 'Teacher']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackStudents);
    const students = await Student.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.json(fallbackStudents);
  }
});

router.post('/students', requireRoles(['Owner', 'Admin', 'Counsellor']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `std-${Date.now()}`, ...req.body });
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== DIGITAL LIBRARY ==================== */
router.get('/library/books', requireRoles(['Owner', 'Admin', 'Librarian', 'Teacher', 'Student']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackBooks);
    const books = await Book.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.json(fallbackBooks);
  }
});

router.post('/library/books', requireRoles(['Owner', 'Admin', 'Librarian']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `bk-${Date.now()}`, ...req.body });
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== HOMEWORK ==================== */
router.get('/homework', requireRoles(['Owner', 'Admin', 'Teacher', 'Student', 'Parent']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackHomeworks);
    const homeworks = await Homework.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(homeworks);
  } catch (err) {
    res.json(fallbackHomeworks);
  }
});

router.post('/homework', requireRoles(['Owner', 'Admin', 'Teacher']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `hw-${Date.now()}`, ...req.body });
    const hw = new Homework(req.body);
    await hw.save();
    res.status(201).json(hw);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== SCHOLARSHIPS ==================== */
router.get('/scholarships', requireRoles(['Owner', 'Admin', 'Accountant']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackScholarships);
    const list = await Scholarship.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.json(fallbackScholarships);
  }
});

router.post('/scholarships', requireRoles(['Owner', 'Admin', 'Accountant']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `sch-${Date.now()}`, ...req.body });
    const sch = new Scholarship(req.body);
    await sch.save();
    res.status(201).json(sch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== PTM ==================== */
router.get('/ptm', requireRoles(['Owner', 'Admin', 'Teacher', 'Parent']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackPTMs);
    const ptms = await PTM.find({ isDeleted: false }).sort({ meetingDate: -1 });
    res.json(ptms);
  } catch (err) {
    res.json(fallbackPTMs);
  }
});

router.post('/ptm', requireRoles(['Owner', 'Admin', 'Teacher']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `ptm-${Date.now()}`, ...req.body });
    const ptm = new PTM(req.body);
    await ptm.save();
    res.status(201).json(ptm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== EXAMS ==================== */
router.get('/exams', requireRoles(['Owner', 'Admin', 'Teacher', 'Student', 'Parent']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackExams);
    const exams = await Exam.find({ isDeleted: false }).sort({ examDate: -1 });
    res.json(exams);
  } catch (err) {
    res.json(fallbackExams);
  }
});

router.post('/exams', requireRoles(['Owner', 'Admin', 'Teacher']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `ex-${Date.now()}`, ...req.body });
    const exam = new Exam(req.body);
    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== CALENDAR ==================== */
router.get('/calendar/events', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackEvents);
    const events = await AcademicEvent.find({ isDeleted: false }).sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    res.json(fallbackEvents);
  }
});

router.post('/calendar/events', requireRoles(['Owner', 'Admin', 'Teacher']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `evt-${Date.now()}`, ...req.body });
    const evt = new AcademicEvent(req.body);
    await evt.save();
    res.status(201).json(evt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== TRANSPORT ==================== */
router.get('/transport/routes', requireRoles(['Owner', 'Admin', 'Transport Manager', 'Parent', 'Student']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackRoutes);
    const routes = await TransportRoute.find({ isDeleted: false });
    res.json(routes);
  } catch (err) {
    res.json(fallbackRoutes);
  }
});

router.post('/transport/routes', requireRoles(['Owner', 'Admin', 'Transport Manager']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `rt-${Date.now()}`, ...req.body });
    const route = new TransportRoute(req.body);
    await route.save();
    res.status(201).json(route);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== INVENTORY ==================== */
router.get('/inventory/assets', requireRoles(['Owner', 'Admin', 'Librarian']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackAssets);
    const assets = await Asset.find({ isDeleted: false });
    res.json(assets);
  } catch (err) {
    res.json(fallbackAssets);
  }
});

router.post('/inventory/assets', requireRoles(['Owner', 'Admin', 'Librarian']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `ast-${Date.now()}`, ...req.body });
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== NOTICES ==================== */
router.get('/notices', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackNotices);
    const notices = await Notice.find({ isDeleted: false }).sort({ isPinned: -1, createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.json(fallbackNotices);
  }
});

router.post('/notices', requireRoles(['Owner', 'Admin']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `ntc-${Date.now()}`, ...req.body });
    const notice = new Notice(req.body);
    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== CHAT ==================== */
router.get('/chat/messages', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackMessages);
    const messages = await ChatMessage.find({ isDeleted: false }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.json(fallbackMessages);
  }
});

router.post('/chat/messages', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `msg-${Date.now()}`, ...req.body });
    const msg = new ChatMessage(req.body);
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== LEAVES ==================== */
router.get('/leaves', requireRoles(['Owner', 'Admin', 'HR', 'Teacher']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackLeaves);
    const leaves = await LeaveRequest.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.json(fallbackLeaves);
  }
});

router.post('/leaves', requireRoles(['Owner', 'Admin', 'HR', 'Teacher']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `lv-${Date.now()}`, ...req.body });
    const leave = new LeaveRequest(req.body);
    await leave.save();
    res.status(201).json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== COURSES & BATCHES ==================== */
router.get('/courses', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackCourses);
    const courses = await Course.find({ isDeleted: false });
    res.json(courses);
  } catch (err) {
    res.json(fallbackCourses);
  }
});

router.post('/courses', requireRoles(['Owner', 'Admin', 'Counsellor', 'Teacher']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `crs-${Date.now()}`, ...req.body });
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/batches', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackBatches);
    const batches = await Batch.find({ isDeleted: false }).sort({ startDate: -1 });
    res.json(batches);
  } catch (err) {
    res.json(fallbackBatches);
  }
});

router.post('/batches', requireRoles(['Owner', 'Admin', 'Teacher']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `btc-${Date.now()}`, ...req.body });
    const batch = new Batch(req.body);
    await batch.save();
    res.status(201).json(batch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== ATTENDANCE, FEES & EXPENSES ==================== */
router.get('/attendance', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackAttendance);
    const records = await Attendance.find({ isDeleted: false }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.json(fallbackAttendance);
  }
});

router.post('/attendance', requireRoles(['Owner', 'Admin', 'Teacher']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `att-${Date.now()}`, ...req.body });
    const att = new Attendance(req.body);
    await att.save();
    res.status(201).json(att);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/fees', requireRoles(['Owner', 'Admin', 'Accountant']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackFees);
    const fees = await Fee.find({ isDeleted: false }).sort({ updatedAt: -1 });
    res.json(fees);
  } catch (err) {
    res.json(fallbackFees);
  }
});

router.post('/fees', requireRoles(['Owner', 'Admin', 'Accountant']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `fee-${Date.now()}`, ...req.body });
    const fee = new Fee(req.body);
    await fee.save();
    res.status(201).json(fee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/expenses', requireRoles(['Owner', 'Admin', 'Accountant']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(fallbackExpenses);
    const expenses = await Expense.find({ isDeleted: false }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.json(fallbackExpenses);
  }
});

router.post('/expenses', requireRoles(['Owner', 'Admin', 'Accountant']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `exp-${Date.now()}`, ...req.body });
    const exp = new Expense(req.body);
    await exp.save();
    res.status(201).json(exp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

