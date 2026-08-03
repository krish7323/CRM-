import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { requireRoles } from '../middleware/rbac';
import Lead from '../models/Lead';
import Student from '../models/Student';
import Course from '../models/Course';
import Batch from '../models/Batch';
import Attendance from '../models/Attendance';
import Fee from '../models/Fee';
import Expense from '../models/Expense';
import Certificate from '../models/Certificate';
import Message from '../models/Message';
import { generateReceiptPDF } from '../services/pdfService';

const router = Router();

// Apply auth to API routes
router.use(authenticateJWT);

/* ==================== LEADS / CRM ==================== */
router.get('/leads', async (req: Request, res: Response) => {
  try {
    const leads = await Lead.find().sort({ updatedAt: -1 });
    res.json(leads);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/leads', async (req: Request, res: Response) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    
    const io = req.app.get('io');
    if (io) io.emit('lead:created', lead);

    res.status(201).json(lead);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/leads/:id', async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    const io = req.app.get('io');
    if (io) io.emit('lead:updated', lead);

    res.json(lead);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

/* Convert Lead to Student */
router.post('/leads/:id/convert', requireRoles(['Owner/Admin', 'Manager', 'Counsellor']), async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    const studentCount = await Student.countDocuments();
    const studentId = `ELH-${1001 + studentCount}`;

    const student = new Student({
      studentId,
      leadId: lead._id,
      name: lead.name,
      phone: lead.phone,
      whatsapp: lead.whatsapp,
      email: lead.email,
      courseName: lead.course,
      level: lead.level,
      joiningDate: new Date(),
      admissionDate: new Date(),
      referralSource: lead.source,
      documents: [{ type: 'Photo', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'Submitted' }],
    });

    await student.save();

    const fee = new Fee({
      studentId: student._id,
      studentCode: student.studentId,
      studentName: student.name,
      courseName: `${lead.course} ${lead.level}`,
      totalFee: lead.quotedFee || 18000,
      discount: 0,
      netFee: lead.quotedFee || 18000,
      paidTotal: 0,
      remainingTotal: lead.quotedFee || 18000,
      installments: [
        {
          installmentNo: 1,
          amount: (lead.quotedFee || 18000) / 2,
          dueDate: new Date(Date.now() + 7 * 86400000),
          paidAmount: 0,
          status: 'Pending',
        },
        {
          installmentNo: 2,
          amount: (lead.quotedFee || 18000) / 2,
          dueDate: new Date(Date.now() + 30 * 86400000),
          paidAmount: 0,
          status: 'Pending',
        },
      ],
      status: 'Pending',
    });

    await fee.save();

    lead.status = 'Admission';
    await lead.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('lead:updated', lead);
      io.emit('student:created', student);
    }

    res.status(201).json({ student, fee });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/* ==================== STUDENTS ==================== */
router.get('/students', async (req: Request, res: Response) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/* ==================== COURSES ==================== */
router.get('/courses', async (req: Request, res: Response) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/* ==================== BATCHES ==================== */
router.get('/batches', async (req: Request, res: Response) => {
  try {
    const batches = await Batch.find().sort({ startDate: -1 });
    res.json(batches);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/batches', requireRoles(['Owner/Admin', 'Manager']), async (req: Request, res: Response) => {
  try {
    const { room, days, timing } = req.body;
    const existingConflict = await Batch.findOne({
      room,
      timing,
      days: { $in: days },
      status: 'Ongoing',
    });

    if (existingConflict) {
      return res.status(400).json({
        message: `Conflict detected! Room '${room}' is already booked for timing '${timing}'.`,
      });
    }

    const batch = new Batch(req.body);
    await batch.save();
    res.status(201).json(batch);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== ATTENDANCE ==================== */
router.get('/attendance', async (req: Request, res: Response) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/attendance', requireRoles(['Owner/Admin', 'Manager', 'Teacher']), async (req: Request, res: Response) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();

    const io = req.app.get('io');
    if (io) io.emit('attendance:marked', attendance);

    res.status(201).json(attendance);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== FEES & PDF RECEIPT ==================== */
router.get('/fees', async (req: Request, res: Response) => {
  try {
    const fees = await Fee.find().sort({ updatedAt: -1 });
    res.json(fees);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/fees/:id/pay', requireRoles(['Owner/Admin', 'Manager', 'Accountant']), async (req: Request, res: Response) => {
  try {
    const { installmentNo, amount, mode, transactionRef } = req.body;
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    const inst = fee.installments.find((i) => i.installmentNo === installmentNo);
    if (!inst) return res.status(400).json({ message: 'Installment not found' });

    inst.paidAmount = (inst.paidAmount || 0) + Number(amount);
    inst.paidDate = new Date();
    inst.mode = mode || 'UPI';
    inst.transactionRef = transactionRef || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    if (inst.paidAmount >= inst.amount) {
      inst.status = 'Paid';
    }

    fee.paidTotal = fee.installments.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
    fee.remainingTotal = fee.netFee - fee.paidTotal;

    if (fee.remainingTotal <= 0) {
      fee.status = 'Paid';
    } else if (fee.paidTotal > 0) {
      fee.status = 'Partial';
    }

    await fee.save();

    const io = req.app.get('io');
    if (io) io.emit('fee:paid', fee);

    res.json(fee);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

/* PDF Receipt Download Endpoint */
router.get('/fees/:id/receipt-pdf', async (req: Request, res: Response) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    const instNo = Number(req.query.installmentNo) || 1;
    const pdfBuffer = await generateReceiptPDF(fee, instNo);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ELH_Receipt_${fee.studentCode}_Inst${instNo}.pdf`);
    res.send(pdfBuffer);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/* ==================== EXPENSES ==================== */
router.get('/expenses', async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/expenses', requireRoles(['Owner/Admin', 'Manager', 'Accountant']), async (req: Request, res: Response) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== CERTIFICATES ==================== */
router.get('/certificates', async (req: Request, res: Response) => {
  try {
    const certs = await Certificate.find().sort({ issueDate: -1 });
    res.json(certs);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/* ==================== WHATSAPP & MESSAGES ==================== */
router.get('/messages', async (req: Request, res: Response) => {
  try {
    const msgs = await Message.find().sort({ sentAt: -1 });
    res.json(msgs);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/messages/send', async (req: Request, res: Response) => {
  try {
    const msg = new Message({
      ...req.body,
      status: 'sent',
      sentAt: new Date(),
    });
    await msg.save();
    res.status(201).json(msg);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

/* ==================== DASHBOARD & AGGREGATED STATS ==================== */
router.get('/dashboard/summary', async (req: Request, res: Response) => {
  try {
    const totalStudents = await Student.countDocuments({ isActive: true });
    const totalLeads = await Lead.countDocuments();
    const newLeadsToday = await Lead.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });

    const feeAgg = await Fee.aggregate([
      {
        $group: {
          _id: null,
          totalCollected: { $sum: '$paidTotal' },
          totalPending: { $sum: '$remainingTotal' },
        },
      },
    ]);

    const expenseAgg = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalExpense: { $sum: '$amount' },
        },
      },
    ]);

    const totalCollected = feeAgg[0]?.totalCollected || 0;
    const totalPending = feeAgg[0]?.totalPending || 0;
    const totalExpenses = expenseAgg[0]?.totalExpense || 0;

    res.json({
      totalStudents,
      totalLeads,
      newLeadsToday,
      totalCollected,
      totalPending,
      totalExpenses,
      netProfit: totalCollected - totalExpenses,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
