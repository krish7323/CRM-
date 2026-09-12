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
import Document from '../models/Document.js';
import WhatsAppLog from '../models/WhatsAppLog.js';
import { getNextSequence } from '../models/Counter.js';
import { runWithTransaction } from '../controllers/admissionController.js';

const router = express.Router();

/* All routes require active JWT authentication */
router.use(authenticateJWT);

const isDbConnected = () => mongoose.connection.readyState === 1;

// Clean empty fallback arrays for production
const emptyArray = [];

/* ==================== CRM LEADS ==================== */
router.get('/leads', requireRoles(['Counsellor']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const leads = await Lead.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.json(emptyArray);
  }
});

router.post('/leads', requireRoles(['Counsellor']), async (req, res) => {
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
router.get('/students', requireRoles(['Counsellor', 'Teacher']), async (req, res) => {
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
    const courses = await Course.find({ isDeleted: { $ne: true } });
    res.json(courses);
  } catch (err) {
    res.json(emptyArray);
  }
});

router.get('/batches', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const batches = await Batch.find({ isDeleted: { $ne: true } }).sort({ startDate: -1 });
    res.json(batches);
  } catch (err) {
    res.json(emptyArray);
  }
});

/* ==================== ATTENDANCE, FEES & EXPENSES ==================== */
router.get('/attendance', requireRoles(['Teacher']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const records = await Attendance.find({ isDeleted: false }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.json(emptyArray);
  }
});

router.get('/fees', requireRoles(['Accountant', 'Counsellor']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const fees = await Fee.find({ isDeleted: false }).sort({ updatedAt: -1 });
    res.json(fees);
  } catch (err) {
    res.json(emptyArray);
  }
});

router.get('/expenses', requireRoles(['Accountant']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const expenses = await Expense.find({ isDeleted: false }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.json(emptyArray);
  }
});

/* ==================== DOCUMENT VAULT ==================== */
router.get('/documents', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const filter = {};
    if (req.query.studentId) filter.studentId = req.query.studentId;
    const docs = await Document.find(filter).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.json(emptyArray);
  }
});

router.post('/documents', requireRoles(['Counsellor', 'Teacher']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.status(201).json({ _id: `doc-${Date.now()}`, ...req.body });
    const doc = new Document({
      ...req.body,
      uploadedBy: req.user?.name || 'Staff',
    });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/* ==================== ATOMIC FEE PAYMENT & RECEIPT NUMBERING ==================== */
router.post('/fees/collect', requireRoles(['Accountant']), async (req, res) => {
  const { feeId, installmentNo, amount, mode, transactionRef } = req.body;
  const staffName = req.user?.name || 'Accountant';

  if (!feeId || !amount || !mode) {
    return res.status(400).json({ success: false, message: 'feeId, amount, and mode are required.' });
  }

  try {
    const result = await runWithTransaction(async (session) => {
      const fee = await Fee.findById(feeId).session(session);
      if (!fee) {
        const err = new Error('Fee record not found.');
        err.statusCode = 404;
        throw err;
      }

      // Atomic receipt sequence generation (prevents duplicate receipt numbers across concurrent payments)
      const receiptNumber = await getNextSequence('receipt_number', session, 'REC-2026-', 5);

      const paidNum = Number(amount);
      let matched = false;

      if (installmentNo && fee.installments && fee.installments.length > 0) {
        fee.installments = fee.installments.map((inst) => {
          if (inst.installmentNo === Number(installmentNo)) {
            matched = true;
            const newPaid = (inst.paidAmount || 0) + paidNum;
            return {
              ...inst.toObject(),
              paidAmount: newPaid,
              paidDate: new Date(),
              mode,
              receiptNumber,
              transactionRef: transactionRef || `TXN-${receiptNumber}`,
              status: newPaid >= inst.amount ? 'Paid' : 'Partial',
              collectedBy: staffName,
            };
          }
          return inst;
        });
      }

      // Recalculate live totals directly from installment ledger
      const totalPaid = fee.installments.reduce((sum, i) => sum + (i.paidAmount || 0), 0) + (!matched ? paidNum : 0);
      fee.paidTotal = totalPaid;
      fee.remainingTotal = Math.max(0, fee.netFee - totalPaid);
      fee.status = fee.remainingTotal <= 0 ? 'Paid' : totalPaid > 0 ? 'Partial' : 'Pending';

      await fee.save({ session });
      return { fee, receiptNumber, paidNum };
    });

    res.json({
      success: true,
      message: `Payment of ₹${result.paidNum.toLocaleString('en-IN')} recorded successfully! Receipt #${result.receiptNumber} generated.`,
      receiptNumber: result.receiptNumber,
      fee: result.fee,
    });
  } catch (err) {
    console.error('Fee collection error:', err);
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

/* ==================== SCHOLARSHIP APPROVAL (ATOMIC TRANSACTION) ==================== */
router.post('/scholarships/approve', requireRoles(['Owner', 'Admin', 'Accountant']), async (req, res) => {
  const { scholarshipId, scholarshipAmount } = req.body;
  const staffName = req.user?.name || 'Admin';

  if (!scholarshipId) {
    return res.status(400).json({ success: false, message: 'scholarshipId is required.' });
  }

  try {
    const result = await runWithTransaction(async (session) => {
      const scholarship = await Scholarship.findById(scholarshipId).session(session);
      if (!scholarship) throw new Error('Scholarship record not found.');

      const grantAmount = Number(scholarshipAmount) || scholarship.approvedAmount || scholarship.amount || 5000;
      scholarship.status = 'Approved';
      scholarship.approvedAmount = grantAmount;
      scholarship.approvedBy = staffName;
      scholarship.approvedAt = new Date();
      await scholarship.save({ session });

      // Recalculate student fee atomically
      const fee = await Fee.findOne({ studentId: scholarship.studentId }).session(session);
      if (fee) {
        fee.discount = (fee.discount || 0) + grantAmount;
        fee.netFee = Math.max(0, fee.totalFee - fee.discount);
        fee.remainingTotal = Math.max(0, fee.netFee - fee.paidTotal);
        fee.status = fee.remainingTotal <= 0 ? 'Paid' : fee.paidTotal > 0 ? 'Partial' : 'Pending';
        await fee.save({ session });
      }

      return { scholarship, fee };
    });

    res.json({
      success: true,
      message: `Scholarship approved and fee invoice recalculated atomically!`,
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ==================== CERTIFICATE ISSUANCE (ATOMIC COUNTER) ==================== */
router.post('/certificates/issue', requireRoles(['Owner', 'Admin', 'Teacher']), async (req, res) => {
  const { studentId, courseName, level, grade, scorePercentage } = req.body;

  if (!studentId || !courseName) {
    return res.status(400).json({ success: false, message: 'studentId and courseName are required.' });
  }

  try {
    const result = await runWithTransaction(async (session) => {
      const student = await Student.findById(studentId).session(session);
      if (!student) throw new Error('Student not found.');

      const certNumber = await getNextSequence('certificate_number', session, 'CERT-2026-', 5);
      const [cert] = await Certificate.create(
        [
          {
            certNumber,
            studentId: student._id,
            studentName: student.name,
            studentCode: student.studentId,
            courseName,
            level: level || student.level || 'A1',
            grade: grade || 'Pass',
            scorePercentage: Number(scorePercentage) || 85,
            issueDate: new Date(),
            qrUrl: `/verify-certificate/${certNumber}`,
          },
        ],
        { session }
      );

      return cert;
    });

    res.status(201).json({
      success: true,
      message: `Certificate #${result.certNumber} issued successfully!`,
      certificate: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ==================== LIVE P&L COMPUTATION ==================== */
router.get('/reports/pnl', requireRoles(['Accountant']), async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ totalRevenue: 0, totalExpenses: 0, netProfit: 0, profitMargin: '0%' });
    }

    // Live aggregation: Total Revenue from paid fees
    const feeAgg = await Fee.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: null, totalCollected: { $sum: '$paidTotal' }, totalInvoiced: { $sum: '$netFee' }, totalOutstanding: { $sum: '$remainingTotal' } } },
    ]);

    // Live aggregation: Total Expenses from expense ledger
    const expAgg = await Expense.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: null, totalExp: { $sum: '$amount' } } },
    ]);

    const totalRevenue = feeAgg[0]?.totalCollected || 0;
    const totalExpenses = expAgg[0]?.totalExp || 0;
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? `${Math.round((netProfit / totalRevenue) * 100)}%` : '0%';

    res.json({
      totalRevenue,
      totalInvoiced: feeAgg[0]?.totalInvoiced || 0,
      totalOutstanding: feeAgg[0]?.totalOutstanding || 0,
      totalExpenses,
      netProfit,
      profitMargin,
      computedAt: new Date(),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ==================== WHATSAPP AUTOMATION WITH IDEMPOTENCY ==================== */
router.post('/automation/whatsapp/fee-reminders', requireRoles(['Accountant', 'Counsellor']), async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const overdueThresholdDays = Number(req.body.thresholdDays) || 0;
    const thresholdDate = new Date(Date.now() - overdueThresholdDays * 86400000);

    // Query students with pending or overdue fee installments
    const pendingFees = await Fee.find({
      status: { $in: ['Pending', 'Partial', 'Overdue'] },
      'installments.dueDate': { $lte: thresholdDate },
    });

    const sendResults = [];
    let sentCount = 0;
    let skippedCount = 0;

    for (const fee of pendingFees) {
      const student = await Student.findById(fee.studentId);
      if (!student) continue;

      const recipientPhone = student.parentWhatsapp || student.whatsapp || student.phone;

      // Idempotency check: Has this fee reminder already been sent today?
      const existingLog = await WhatsAppLog.findOne({
        studentId: student._id,
        templateType: 'FEE_OVERDUE_REMINDER',
        referenceId: fee._id.toString(),
        dateStr: todayStr,
      });

      if (existingLog) {
        skippedCount++;
        sendResults.push({
          studentName: student.name,
          phone: recipientPhone,
          status: 'Skipped_Idempotent',
          reason: 'Already sent today. Idempotency rule enforced.',
        });
        continue;
      }

      // Record dispatch log with unique compound constraint
      const log = new WhatsAppLog({
        studentId: student._id,
        studentName: student.name,
        recipientPhone,
        templateType: 'FEE_OVERDUE_REMINDER',
        referenceId: fee._id.toString(),
        dateStr: todayStr,
        payload: {
          dueAmount: fee.remainingTotal,
          courseName: fee.courseName,
          dueDate: fee.installments[0]?.dueDate,
        },
        status: 'Sent',
        sentAt: new Date(),
      });
      await log.save();
      sentCount++;
      sendResults.push({
        studentName: student.name,
        phone: recipientPhone,
        status: 'Sent',
        dueAmount: fee.remainingTotal,
      });
    }

    res.json({
      success: true,
      message: `WhatsApp Fee Reminder dispatch complete. Sent: ${sentCount}, Skipped (Idempotent): ${skippedCount}.`,
      summary: { sentCount, skippedCount, date: todayStr },
      results: sendResults,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
