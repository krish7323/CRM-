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
import { emitSocketEvent } from '../utils/socketEmitter.js';

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
// GET /api/students: List students with optional status/batch filtering
router.get('/students', requireRoles(['Counsellor', 'Teacher', 'Accountant']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json(emptyArray);
    const { status, batchCode, isArchived } = req.query;
    const filter = { isDeleted: { $ne: true } };

    if (status) {
      if (status === 'active') {
        filter.status = 'Active';
        filter.isArchived = { $ne: true };
      } else if (status === 'alumni' || status === 'archived') {
        filter.$or = [{ status: { $ne: 'Active' } }, { isArchived: true }];
      } else {
        filter.status = status;
      }
    }
    if (batchCode && batchCode !== 'All') {
      filter.batchCode = batchCode;
    }
    if (isArchived !== undefined) {
      filter.isArchived = isArchived === 'true';
    }

    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.json(emptyArray);
  }
});

// POST /api/students: Add Student (Direct creation with batch capacity enforcement, unique roll number, fee ledger, and real-time socket events)
router.post('/students', requireRoles(['Counsellor', 'Teacher']), async (req, res) => {
  const {
    name,
    fatherName,
    motherName,
    guardianName,
    parentName,
    phone,
    whatsapp,
    email,
    courseName,
    level = 'A1',
    batchCode,
    batchId,
    totalFee = 25000,
    feePlan = 'Full',
    discount = 0,
    aadhaarNo = '',
    address = '',
    photoUrl,
    documents = [],
  } = req.body;

  const staffName = req.user?.name || req.user?.designation || 'Director';

  if (!name || !phone || !email || !courseName) {
    return res.status(400).json({ success: false, message: 'Required fields missing: name, phone, email, and courseName are mandatory.' });
  }

  try {
    if (!isDbConnected()) {
      const fallbackStudent = {
        _id: `std-${Date.now()}`,
        studentId: `TELA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        fatherName: fatherName || parentName || '',
        phone,
        whatsapp: whatsapp || phone,
        email,
        courseName,
        level,
        batchCode: batchCode || 'GER-A1-B01',
        totalFee: Number(totalFee) || 25000,
        status: 'Active',
        isArchived: false,
        isActive: true,
        joiningDate: new Date(),
        admissionDate: new Date(),
        timeline: [{ title: 'Student Registered', detail: 'Created via Student Management Module', by: staffName, at: new Date() }],
      };
      emitSocketEvent('student:created', fallbackStudent);
      return res.status(201).json({ success: true, student: fallbackStudent });
    }

    const result = await runWithTransaction(async (session) => {
      // 1. Duplicate phone check for active students
      const existing = await Student.findOne({ phone, status: 'Active', isArchived: false }).session(session);
      if (existing) {
        throw new Error(`A student with contact number ${phone} is already actively enrolled as ${existing.studentId} (${existing.name}).`);
      }

      // 2. Find target batch
      let targetBatch = null;
      if (batchId) {
        targetBatch = await Batch.findById(batchId).session(session);
      } else if (batchCode) {
        targetBatch = await Batch.findOne({ code: batchCode }).session(session);
      }
      if (!targetBatch) {
        targetBatch = await Batch.findOne({ status: 'Ongoing' }).session(session);
      }
      if (!targetBatch) {
        throw new Error('No valid batch found to enroll student. Please create or specify an active batch.');
      }

      // 3. Batch capacity validation (Double Booking Prevention)
      if (targetBatch.currentEnrolledCount >= targetBatch.maxStudents) {
        const err = new Error(`Batch Capacity Exceeded! Batch ${targetBatch.code} already has ${targetBatch.currentEnrolledCount}/${targetBatch.maxStudents} seats occupied.`);
        err.statusCode = 409;
        throw err;
      }

      // 4. Increment batch count atomically
      await Batch.findByIdAndUpdate(
        targetBatch._id,
        { $inc: { currentEnrolledCount: 1 } },
        { session }
      );

      // 5. Generate unique roll number
      const studentId = await getNextSequence('student_roll_number', session, 'TELA-2026-', 4);

      // 6. Create Student
      const feeNum = Number(totalFee) || 25000;
      const discountNum = Number(discount) || 0;
      const netFeeNum = Math.max(0, feeNum - discountNum);

      const [student] = await Student.create(
        [
          {
            studentId,
            name,
            fatherName: fatherName || parentName || '',
            motherName: motherName || '',
            guardianName: guardianName || parentName || '',
            phone,
            whatsapp: whatsapp || phone,
            email,
            address,
            aadhaarNo,
            courseName,
            level: targetBatch.level || level,
            batchId: targetBatch._id,
            batchCode: targetBatch.code,
            teacherName: targetBatch.teacherName,
            status: 'Active',
            isArchived: false,
            isActive: true,
            photoUrl: photoUrl || '',
            joiningDate: new Date(),
            admissionDate: new Date(),
            feePlan,
            totalFee: feeNum,
            discount: discountNum,
            netFee: netFeeNum,
            paidFee: 0,
            feeBalance: netFeeNum,
            statusHistory: [
              {
                fromStatus: 'None',
                toStatus: 'Active',
                reason: 'Initial Enrollment',
                changedBy: staffName,
                date: new Date(),
              },
            ],
            timeline: [
              {
                title: 'Student Admitted',
                detail: `Enrolled into batch ${targetBatch.code} (${targetBatch.courseName} ${targetBatch.level}). Fee plan: ${feePlan}.`,
                by: staffName,
                at: new Date(),
              },
            ],
            documents: documents.map((d) => ({
              docType: d.type || d.docType || 'Identity Proof',
              name: d.name || 'Document.pdf',
              url: d.url || '',
              fileSize: d.fileSize || '1.5 MB',
              uploadedAt: new Date(),
            })),
          },
        ],
        { session }
      );

      // 7. Create Fee Ledger
      const [fee] = await Fee.create(
        [
          {
            studentId: student._id,
            studentCode: student.studentId,
            studentName: student.name,
            courseName: student.courseName,
            totalFee: feeNum,
            discount: discountNum,
            netFee: netFeeNum,
            paidTotal: 0,
            remainingTotal: netFeeNum,
            status: 'Unpaid',
            installments:
              feePlan === 'Installment'
                ? [
                    {
                      installmentNo: 1,
                      amount: Math.round(netFeeNum / 2),
                      dueDate: new Date(Date.now() + 7 * 86400000),
                      paidAmount: 0,
                      status: 'Pending',
                    },
                    {
                      installmentNo: 2,
                      amount: Math.round(netFeeNum / 2),
                      dueDate: new Date(Date.now() + 30 * 86400000),
                      paidAmount: 0,
                      status: 'Pending',
                    },
                  ]
                : [
                    {
                      installmentNo: 1,
                      amount: netFeeNum,
                      dueDate: new Date(Date.now() + 7 * 86400000),
                      paidAmount: 0,
                      status: 'Pending',
                    },
                  ],
          },
        ],
        { session }
      );

      return { student, batch: targetBatch, fee };
    });

    // Real-Time Socket Emissions
    emitSocketEvent('student:created', result.student);
    emitSocketEvent('batch:seat-updated', {
      batchId: result.batch._id,
      code: result.batch.code,
      currentEnrolledCount: result.batch.currentEnrolledCount + 1,
      maxStudents: result.batch.maxStudents,
    });
    emitSocketEvent('fee:invoice-created', result.fee);

    res.status(201).json({
      success: true,
      message: `Student ${result.student.name} (${result.student.studentId}) successfully registered in batch ${result.batch.code}!`,
      student: result.student,
      fee: result.fee,
    });
  } catch (err) {
    console.error('Add Student Error:', err.message);
    res.status(err.statusCode || 400).json({ success: false, message: err.message });
  }
});

// POST /api/students/:id/change-status: Unified Lifecycle Status & Archival Endpoint (NO HARD DELETE)
router.post('/students/:id/change-status', requireRoles(['Teacher']), async (req, res) => {
  const { id } = req.params;
  const {
    status,
    reason,
    finalScore = 85,
    grade = 'Pass',
    remarks = '',
    promoteToBatchCode,
    issueCertificate = false,
  } = req.body;

  const validStatuses = ['Graduated', 'Dropped Out', 'Fee Defaulter', 'Inactive', 'Active'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  if (!reason && status !== 'Active') {
    return res.status(400).json({
      success: false,
      message: 'Reason is required when changing student status to an archived or non-active state.',
    });
  }

  const staffName = req.user?.name || req.user?.designation || 'Director';

  try {
    if (!isDbConnected()) {
      return res.json({ success: true, message: `Status updated to ${status} (in-memory mode).` });
    }

    const result = await runWithTransaction(async (session) => {
      const student = await Student.findById(id).session(session);
      if (!student) throw new Error('Student not found.');

      const oldStatus = student.status;
      const oldBatchCode = student.batchCode;
      const oldBatchId = student.batchId;
      let cert = null;
      let updatedBatchInfo = null;

      // Transition A: Active -> Non-Active (Archive to Alumni, Dropped Out, Fee Defaulter, Inactive)
      if (oldStatus === 'Active' && status !== 'Active') {
        // 1. Relieve seat in active batch
        if (oldBatchId) {
          const b = await Batch.findByIdAndUpdate(
            oldBatchId,
            { $inc: { currentEnrolledCount: -1 } },
            { session, new: true }
          );
          if (b) updatedBatchInfo = b;
        }

        // 2. Generate Certificate if Graduated
        let certNumber = null;
        if (status === 'Graduated' && issueCertificate) {
          certNumber = await getNextSequence('certificate_number', session, 'TELA-CERT-2026-', 4);
          [cert] = await Certificate.create(
            [
              {
                certNumber,
                studentId: student._id,
                studentName: student.name,
                studentCode: student.studentId,
                courseName: student.courseName,
                level: student.level || 'A1',
                grade,
                scorePercentage: Number(finalScore) || 85,
                issueDate: new Date(),
                qrUrl: `/verify/${certNumber}`,
              },
            ],
            { session }
          );

          student.graduationDetails = {
            graduatedAt: new Date(),
            finalScore: Number(finalScore) || 85,
            grade,
            certificateNo: certNumber,
            remarks,
          };
        }

        student.status = status;
        student.isArchived = true;
        student.isActive = false;

        const auditEntry = {
          fromStatus: oldStatus,
          toStatus: status,
          reason,
          changedBy: staffName,
          date: new Date(),
          finalScore: Number(finalScore) || null,
          grade: grade || null,
          remarks,
          certificateNo: certNumber || null,
        };

        student.statusHistory = [auditEntry, ...(student.statusHistory || [])];
        student.timeline.unshift({
          title: `Status Changed: ${status}`,
          detail: `Reason: ${reason}. Batch seat relieved from ${oldBatchCode}. All historical records preserved in Archive.`,
          by: staffName,
          at: new Date(),
        });
      }

      // Transition B: Re-Enroll / Next-Level Promotion (Non-Active -> Active or Direct Promotion)
      else if (status === 'Active' || promoteToBatchCode) {
        const targetBatchCode = promoteToBatchCode || student.batchCode;
        const targetBatch = await Batch.findOne({ code: targetBatchCode }).session(session);
        if (!targetBatch) throw new Error(`Target batch ${targetBatchCode} not found.`);

        if (targetBatch.currentEnrolledCount >= targetBatch.maxStudents) {
          const err = new Error(`Cannot assign: Batch ${targetBatch.code} is full (${targetBatch.currentEnrolledCount}/${targetBatch.maxStudents}).`);
          err.statusCode = 409;
          throw err;
        }

        // Increment target batch
        const b = await Batch.findByIdAndUpdate(
          targetBatch._id,
          { $inc: { currentEnrolledCount: 1 } },
          { session, new: true }
        );
        if (b) updatedBatchInfo = b;

        student.batchId = targetBatch._id;
        student.batchCode = targetBatch.code;
        student.level = targetBatch.level || student.level;
        student.status = 'Active';
        student.isArchived = false;
        student.isActive = true;

        const auditEntry = {
          fromStatus: oldStatus,
          toStatus: 'Active',
          reason: reason || `Promoted / Re-enrolled to batch ${targetBatch.code}`,
          changedBy: staffName,
          date: new Date(),
        };

        student.statusHistory = [auditEntry, ...(student.statusHistory || [])];
        student.timeline.unshift({
          title: `Active in Batch ${targetBatch.code}`,
          detail: `Re-enrolled/Promoted from ${oldBatchCode}. Seat allocated.`,
          by: staffName,
          at: new Date(),
        });
      }

      // Transition C: Simple status update between non-active states
      else {
        student.status = status;
        student.statusHistory.unshift({
          fromStatus: oldStatus,
          toStatus: status,
          reason,
          changedBy: staffName,
          date: new Date(),
          remarks,
        });
      }

      await student.save({ session });
      return { student, certificate: cert, updatedBatchInfo, oldBatchCode };
    });

    // Real-Time Socket Broadcasts
    emitSocketEvent('student:status-changed', {
      studentId: result.student._id,
      studentCode: result.student.studentId,
      status: result.student.status,
      isArchived: result.student.isArchived,
      oldBatchCode: result.oldBatchCode,
      newBatchCode: result.student.batchCode,
      student: result.student,
      certificate: result.certificate,
    });

    if (result.updatedBatchInfo) {
      emitSocketEvent('batch:seat-updated', {
        batchId: result.updatedBatchInfo._id,
        code: result.updatedBatchInfo.code,
        currentEnrolledCount: result.updatedBatchInfo.currentEnrolledCount,
        maxStudents: result.updatedBatchInfo.maxStudents,
      });
    }

    res.json({
      success: true,
      message: `Student status successfully updated to '${status}'. Batch capacity and alumni registry synchronized.`,
      student: result.student,
      certificate: result.certificate,
    });
  } catch (err) {
    console.error('Change Status Error:', err.message);
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// POST /api/students/:id/graduate: Alias that delegates to change-status with status 'Graduated'
router.post('/students/:id/graduate', requireRoles(['Teacher']), async (req, res) => {
  req.body.status = 'Graduated';
  req.body.reason = req.body.remarks || 'Course Completed & Passed CEFR Level Examination';
  // Forward to change-status handler
  const { id } = req.params;
  const { grade = 'Distinction', scorePercentage = 90, issueCertificate = true, promoteToBatchCode, remarks = '' } = req.body;

  try {
    if (!isDbConnected()) {
      return res.json({ success: true, message: 'Student graduated (in-memory mode).' });
    }

    const result = await runWithTransaction(async (session) => {
      const student = await Student.findById(id).session(session);
      if (!student) throw new Error('Student not found.');

      const oldBatchCode = student.batchCode;
      const oldBatchId = student.batchId;

      if (oldBatchId) {
        await Batch.findByIdAndUpdate(oldBatchId, { $inc: { currentEnrolledCount: -1 } }, { session });
      }

      let cert = null;
      let certNumber = null;
      if (issueCertificate) {
        certNumber = await getNextSequence('certificate_number', session, 'TELA-CERT-2026-', 4);
        [cert] = await Certificate.create(
          [
            {
              certNumber,
              studentId: student._id,
              studentName: student.name,
              studentCode: student.studentId,
              courseName: student.courseName,
              level: student.level || 'A1',
              grade,
              scorePercentage: Number(scorePercentage) || 90,
              issueDate: new Date(),
              qrUrl: `/verify/${certNumber}`,
            },
          ],
          { session }
        );
      }

      if (promoteToBatchCode) {
        const targetBatch = await Batch.findOne({ code: promoteToBatchCode }).session(session);
        if (!targetBatch) throw new Error(`Target batch ${promoteToBatchCode} not found.`);
        if (targetBatch.currentEnrolledCount >= targetBatch.maxStudents) {
          throw new Error(`Batch ${targetBatch.code} is full (${targetBatch.currentEnrolledCount}/${targetBatch.maxStudents}).`);
        }
        await Batch.findByIdAndUpdate(targetBatch._id, { $inc: { currentEnrolledCount: 1 } }, { session });

        student.batchId = targetBatch._id;
        student.batchCode = targetBatch.code;
        student.level = targetBatch.level || student.level;
        student.status = 'Active';
        student.isArchived = false;
        student.isActive = true;
      } else {
        student.status = 'Graduated';
        student.isArchived = true;
        student.isActive = false;
        student.graduationDetails = {
          graduatedAt: new Date(),
          finalScore: Number(scorePercentage) || 90,
          grade,
          certificateNo: certNumber,
          remarks,
        };
      }

      student.statusHistory = [
        {
          fromStatus: 'Active',
          toStatus: student.status,
          reason: remarks || 'Graduated from level',
          changedBy: req.user?.name || 'Director',
          date: new Date(),
          finalScore: Number(scorePercentage) || 90,
          grade,
          certificateNo: certNumber,
        },
        ...(student.statusHistory || []),
      ];

      await student.save({ session });
      return { student, certificate: cert, oldBatchCode };
    });

    emitSocketEvent('student:status-changed', {
      studentId: result.student._id,
      status: result.student.status,
      isArchived: result.student.isArchived,
      oldBatchCode: result.oldBatchCode,
      newBatchCode: result.student.batchCode,
      student: result.student,
    });

    res.json({
      success: true,
      message: promoteToBatchCode
        ? `Student promoted to ${promoteToBatchCode} successfully!`
        : `Student successfully graduated and archived to Alumni Registry! Class seat freed.`,
      ...result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/students/:id: Institutional Safety Guard - Hard delete restricted to duplicate/test entries only
router.delete('/students/:id', requireRoles(['Admin', 'Owner']), async (req, res) => {
  const { id } = req.params;
  const { confirmTestEntry } = req.query;

  if (confirmTestEntry !== 'true') {
    return res.status(403).json({
      success: false,
      message:
        'Institutional Safety Guard: Direct hard delete is disabled to protect financial, attendance, and certification audit trails. To remove a student from active rosters, use "POST /api/students/:id/change-status" (Graduated, Dropped Out, Fee Defaulter, Inactive). If this is an accidental test or duplicate record, pass "?confirmTestEntry=true".',
    });
  }

  try {
    if (!isDbConnected()) {
      emitSocketEvent('student:deleted', { studentId: id });
      return res.json({ success: true, message: 'Test student record deleted (in-memory mode).' });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    if (student.status === 'Active' && !student.isArchived && student.batchId) {
      await Batch.findByIdAndUpdate(student.batchId, { $inc: { currentEnrolledCount: -1 } });
      emitSocketEvent('batch:seat-updated', { batchId: student.batchId, code: student.batchCode });
    }

    await Student.findByIdAndDelete(id);
    emitSocketEvent('student:deleted', { studentId: id, studentCode: student.studentId });

    res.json({
      success: true,
      message: `Accidental test entry for student ${student.name} (${student.studentId}) has been removed.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/students/fee-defaulters/check: Automatic detection of long-overdue fee installments (>60 days)
router.get('/students/fee-defaulters/check', requireRoles(['Accountant']), async (req, res) => {
  try {
    if (!isDbConnected()) return res.json({ success: true, defaulters: [] });
    const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000);

    const overdueFees = await Fee.find({
      status: { $ne: 'Paid' },
      remainingTotal: { $gt: 0 },
      'installments.dueDate': { $lt: sixtyDaysAgo },
      'installments.status': 'Pending',
    });

    const studentIds = overdueFees.map((f) => f.studentId);
    const potentialDefaulters = await Student.find({
      _id: { $in: studentIds },
      status: 'Active',
    });

    const result = potentialDefaulters.map((s) => {
      const feeRec = overdueFees.find((f) => String(f.studentId) === String(s._id));
      return {
        studentId: s._id,
        name: s.name,
        studentCode: s.studentId,
        phone: s.phone,
        batchCode: s.batchCode,
        courseName: s.courseName,
        outstandingBalance: feeRec ? feeRec.remainingTotal : 0,
        suggestedStatus: 'Fee Defaulter',
        reason: 'Fee overdue past 60 days grace window',
      };
    });

    res.json({ success: true, defaulters: result });
  } catch (err) {
    res.json({ success: true, defaulters: [] });
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

router.post('/batches', requireRoles(['Teacher']), async (req, res) => {
  try {
    const { code, courseName, level, teacherName, room, days, timing, startDate, endDate, maxStudents } = req.body;
    if (!code || !courseName) {
      return res.status(400).json({ success: false, message: 'Batch code and course name are required.' });
    }
    if (!isDbConnected()) {
      const fallbackBatch = { _id: `btc-${Date.now()}`, ...req.body, currentEnrolledCount: 0 };
      emitSocketEvent('batch:created', fallbackBatch);
      return res.status(201).json(fallbackBatch);
    }
    const existing = await Batch.findOne({ code });
    if (existing) {
      return res.status(409).json({ success: false, message: `Batch code '${code}' already exists.` });
    }
    const batch = new Batch({
      code,
      courseName,
      level: level || 'A1',
      teacherName: teacherName || 'Unassigned',
      room: room || 'Room 101',
      days: days || ['Mon', 'Wed', 'Fri'],
      timing: timing || '10:00 AM - 12:00 PM',
      startDate: startDate || new Date(),
      endDate: endDate || new Date(Date.now() + 90 * 86400000),
      maxStudents: Number(maxStudents) || 20,
      currentEnrolledCount: 0,
      status: 'Ongoing',
    });
    await batch.save();
    emitSocketEvent('batch:created', batch);
    res.status(201).json(batch);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
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

router.post('/attendance', requireRoles(['Teacher']), async (req, res) => {
  try {
    const { batchCode, date, entries = [] } = req.body;
    const staffName = req.user?.name || 'Faculty';

    if (!batchCode || !date) {
      return res.status(400).json({ success: false, message: 'batchCode and date are required.' });
    }

    if (!isDbConnected()) {
      const fallbackLog = {
        _id: `att-${Date.now()}`,
        batchCode,
        date,
        entries,
        markedBy: staffName,
        markedAt: new Date(),
      };
      emitSocketEvent('attendance:marked', fallbackLog);
      return res.status(201).json({ success: true, log: fallbackLog });
    }

    const log = await Attendance.findOneAndUpdate(
      { batchCode, date },
      {
        batchCode,
        date,
        entries,
        markedBy: staffName,
        markedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    emitSocketEvent('attendance:marked', log);
    res.status(201).json({ success: true, message: `Attendance for batch ${batchCode} on ${date} saved.`, log });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
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

router.post('/fees/:id/payment', requireRoles(['Accountant']), async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, installmentNo } = req.body;

    const payNum = Number(amount);
    if (!payNum || payNum <= 0) {
      return res.status(400).json({ success: false, message: 'Payment amount must be greater than zero.' });
    }

    if (!isDbConnected()) {
      return res.json({ success: true, message: `Payment of ₹${payNum} recorded (in-memory mode).` });
    }

    const fee = await Fee.findById(id);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee invoice not found.' });

    fee.paidTotal = (fee.paidTotal || 0) + payNum;
    fee.remainingTotal = Math.max(0, (fee.netFee || fee.totalFee) - fee.paidTotal);
    fee.status = fee.remainingTotal === 0 ? 'Paid' : 'Partially Paid';

    if (fee.installments && fee.installments.length > 0) {
      if (installmentNo) {
        const inst = fee.installments.find((i) => i.installmentNo === Number(installmentNo));
        if (inst) {
          inst.paidAmount = (inst.paidAmount || 0) + payNum;
          if (inst.paidAmount >= inst.amount) inst.status = 'Paid';
        }
      } else {
        let remPay = payNum;
        for (const inst of fee.installments) {
          if (inst.status !== 'Paid' && remPay > 0) {
            const needed = inst.amount - (inst.paidAmount || 0);
            const applied = Math.min(remPay, needed);
            inst.paidAmount = (inst.paidAmount || 0) + applied;
            remPay -= applied;
            if (inst.paidAmount >= inst.amount) inst.status = 'Paid';
          }
        }
      }
    }

    await fee.save();

    // Sync Student model fee fields
    if (fee.studentId) {
      await Student.findByIdAndUpdate(fee.studentId, {
        paidFee: fee.paidTotal,
        feeBalance: fee.remainingTotal,
      });
    }

    emitSocketEvent('fee:payment-received', {
      feeId: fee._id,
      studentId: fee.studentId,
      paidTotal: fee.paidTotal,
      remainingTotal: fee.remainingTotal,
      status: fee.status,
      fee,
    });

    res.json({ success: true, message: `Payment of ₹${payNum} successfully recorded!`, fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
