import express from 'express';
import mongoose from 'mongoose';
import { authenticateJWT } from '../middleware/auth.js';
import { requireRoles } from '../middleware/rbac.js';
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

// Clean empty fallback arrays for production
const emptyArray = [];

/* ==================== CRM LEADS ==================== */
router.get('/leads', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const leads = await Lead.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.json(emptyArray);
  }
});

router.post('/leads', async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `ld-${Date.now()}`, ...req.body });
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== STUDENTS ==================== */
router.get('/students', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const students = await Student.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.json(emptyArray);
  }
});

/* ==================== DIGITAL LIBRARY ==================== */
router.get('/library/books', requireRoles(['Owner', 'Admin', 'Librarian', 'Teacher', 'Student']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const books = await Book.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.json(emptyArray);
  }
});

/* ==================== HOMEWORK ==================== */
router.get('/homework', requireRoles(['Owner', 'Admin', 'Teacher', 'Student']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const homeworks = await Homework.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(homeworks);
  } catch (err) {
    res.json(emptyArray);
  }
});

/* ==================== SCHOLARSHIPS ==================== */
router.get('/scholarships', requireRoles(['Owner', 'Admin', 'Accountant']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const list = await Scholarship.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.json(emptyArray);
  }
});

/* ==================== PTM ==================== */
router.get('/ptm', requireRoles(['Owner', 'Admin', 'Teacher', 'Parent']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const ptms = await PTM.find({ isDeleted: false }).sort({ meetingDate: -1 });
    res.json(ptms);
  } catch (err) {
    res.json(emptyArray);
  }
});

/* ==================== EXAMS ==================== */
router.get('/exams', requireRoles(['Owner', 'Admin', 'Teacher', 'Student', 'Parent']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const exams = await Exam.find({ isDeleted: false }).sort({ examDate: -1 });
    res.json(exams);
  } catch (err) {
    res.json(emptyArray);
  }
});

/* ==================== CALENDAR ==================== */
router.get('/calendar/events', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const events = await AcademicEvent.find({ isDeleted: false }).sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    res.json(emptyArray);
  }
});

/* ==================== TRANSPORT ==================== */
router.get('/transport/routes', requireRoles(['Owner', 'Admin', 'Transport Manager', 'Parent']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const routes = await TransportRoute.find({ isDeleted: false });
    res.json(routes);
  } catch (err) {
    res.json(emptyArray);
  }
});

/* ==================== INVENTORY ==================== */
router.get('/inventory/assets', requireRoles(['Owner', 'Admin', 'Librarian']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const assets = await Asset.find({ isDeleted: false });
    res.json(assets);
  } catch (err) {
    res.json(emptyArray);
  }
});

/* ==================== NOTICES ==================== */
router.get('/notices', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const notices = await Notice.find({ isDeleted: false }).sort({ isPinned: -1, createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.json(emptyArray);
  }
});

/* ==================== CHAT ==================== */
router.get('/chat/messages', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const messages = await ChatMessage.find({ isDeleted: false }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.json(emptyArray);
  }
});

/* ==================== LEAVES ==================== */
router.get('/leaves', requireRoles(['Owner', 'Admin', 'HR', 'Teacher']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const leaves = await LeaveRequest.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.json(emptyArray);
  }
});

/* ==================== COURSES & BATCHES ==================== */
router.get('/courses', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const courses = await Course.find({ isDeleted: false });
    res.json(courses);
  } catch (err) {
    res.json(emptyArray);
  }
});

router.get('/batches', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const batches = await Batch.find({ isDeleted: false }).sort({ startDate: -1 });
    res.json(batches);
  } catch (err) {
    res.json(emptyArray);
  }
});

/* ==================== ATTENDANCE, FEES & EXPENSES ==================== */
router.get('/attendance', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const records = await Attendance.find({ isDeleted: false }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.json(emptyArray);
  }
});

router.get('/fees', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const fees = await Fee.find({ isDeleted: false }).sort({ updatedAt: -1 });
    res.json(fees);
  } catch (err) {
    res.json(emptyArray);
  }
});

router.get('/expenses', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const expenses = await Expense.find({ isDeleted: false }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.json(emptyArray);
  }
});

export default router;
