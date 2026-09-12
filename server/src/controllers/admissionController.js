import mongoose from 'mongoose';
import Student from '../models/Student.js';
import Lead from '../models/Lead.js';
import Batch from '../models/Batch.js';
import Fee from '../models/Fee.js';
import Document from '../models/Document.js';
import { getNextSequence } from '../models/Counter.js';

/**
 * Execute a function within a MongoDB multi-document transaction,
 * with automatic retries for TransientTransactionError and UnknownTransactionCommitResult.
 */
export async function runWithTransaction(workFn, maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    attempt++;
    const session = await mongoose.startSession();
    try {
      let result;
      await session.withTransaction(
        async () => {
          result = await workFn(session);
        },
        {
          readPreference: 'primary',
          readConcern: { level: 'local' },
          writeConcern: { w: 'majority' },
        }
      );
      return result;
    } catch (err) {
      const isTransient =
        err.hasErrorLabel &&
        (err.hasErrorLabel('TransientTransactionError') ||
          err.hasErrorLabel('UnknownTransactionCommitResult'));

      if (isTransient && attempt < maxRetries) {
        console.warn(`⚠️ Transient transaction error encountered on attempt ${attempt}. Retrying...`, err.message);
        continue;
      }
      throw err;
    } finally {
      await session.endSession();
    }
  }
}

/**
 * PATH A: Convert Interested Lead to Enrolled Student (Single Atomic Transaction)
 */
export const enrollLead = async (req, res) => {
  const { leadId, batchId, customFee } = req.body;
  const staffName = req.user?.name || 'Staff';

  if (!leadId) {
    return res.status(400).json({ success: false, message: 'leadId is required.' });
  }
  if (!batchId) {
    return res.status(400).json({ success: false, message: 'batchId is required for admission. Every student must be assigned to a batch.' });
  }

  try {
    const result = await runWithTransaction(async (session) => {
      // Step 1: Fetch and validate Lead
      const lead = await Lead.findById(leadId).session(session);
      if (!lead) {
        throw new Error('Lead not found.');
      }
      if (lead.status !== 'interested') {
        throw new Error(`Cannot enroll lead. Lead status must be 'interested' (current: '${lead.status}'). At least one follow-up interaction is required before enrollment.`);
      }
      if (!lead.followUps || lead.followUps.length === 0) {
        throw new Error('Data Integrity Violation: Cannot enroll lead without at least one logged follow-up interaction.');
      }

      // Step 2: Atomic Conditional Batch Reservation & Capacity Enforcement
      const updatedBatch = await Batch.findOneAndUpdate(
        {
          _id: batchId,
          $expr: { $lt: ['$currentEnrolledCount', '$maxStudents'] },
        },
        { $inc: { currentEnrolledCount: 1 } },
        { session, new: true }
      );

      if (!updatedBatch) {
        // Find batch to provide accurate seat diagnostics in error
        const batchInfo = await Batch.findById(batchId).session(session);
        const capacityMsg = batchInfo
          ? `Seat no longer available. Batch '${batchInfo.code}' is at full capacity (${batchInfo.currentEnrolledCount}/${batchInfo.maxStudents}).`
          : 'Selected batch does not exist.';
        const err = new Error(capacityMsg);
        err.statusCode = 409;
        throw err;
      }

      // Step 3: Atomic Unique Roll Number Generation
      const studentId = await getNextSequence('student_roll_number', session, 'TELA-2026-', 4);

      // Step 4: Create Student Record
      const [student] = await Student.create(
        [
          {
            studentId,
            leadId: lead._id,
            enrollmentType: 'Path_A_CRM',
            name: lead.name,
            parentName: lead.parentName || 'Guardian',
            phone: lead.phone,
            whatsapp: lead.whatsapp || lead.phone,
            email: lead.email,
            aadhaarNo: lead.aadhaarNo || '',
            courseName: lead.course,
            level: lead.level || 'A1',
            batchId: updatedBatch._id,
            batchCode: updatedBatch.code,
            teacherName: updatedBatch.teacherName,
            joiningDate: new Date(),
            admissionDate: new Date(),
            status: 'Active',
            verificationStatus: 'Verified',
            timeline: [
              {
                title: 'Enrolled via CRM Lead Conversion',
                detail: `Lead converted to student and assigned to batch ${updatedBatch.code}. Initial fee plan generated.`,
                by: staffName,
                at: new Date(),
              },
            ],
          },
        ],
        { session }
      );

      // Step 5: Update Lead status to 'converted' with link to student
      lead.status = 'converted';
      lead.convertedStudentId = student._id;
      lead.statusHistory.push({
        fromStatus: 'interested',
        toStatus: 'converted',
        changedBy: staffName,
        changedAt: new Date(),
        reason: `Enrolled as student ${student.studentId} in batch ${updatedBatch.code}`,
      });
      await lead.save({ session });

      // Step 6: Generate Initial Fee Invoice Plan atomically
      const totalFee = Number(customFee) || lead.quotedFee || 25000;
      const [fee] = await Fee.create(
        [
          {
            studentId: student._id,
            studentCode: student.studentId,
            studentName: student.name,
            courseName: student.courseName,
            totalFee,
            discount: 0,
            netFee: totalFee,
            paidTotal: 0,
            remainingTotal: totalFee,
            status: 'Pending',
            installments: [
              {
                installmentNo: 1,
                amount: Math.round(totalFee / 2),
                dueDate: new Date(Date.now() + 7 * 86400000),
                paidAmount: 0,
                status: 'Pending',
              },
              {
                installmentNo: 2,
                amount: Math.round(totalFee / 2),
                dueDate: new Date(Date.now() + 30 * 86400000),
                paidAmount: 0,
                status: 'Pending',
              },
            ],
          },
        ],
        { session }
      );

      // Step 7: Create initial ID document record if Aadhaar provided
      if (lead.aadhaarNo) {
        await Document.create(
          [
            {
              studentId: student._id,
              studentCode: student.studentId,
              studentName: student.name,
              type: 'Aadhaar / ID Proof',
              name: `Aadhaar_${student.name.replace(/\s+/g, '_')}_Verified.pdf`,
              status: 'Verified',
              uploadedBy: staffName,
            },
          ],
          { session }
        );
      }

      return { student, lead, batch: updatedBatch, fee };
    });

    res.status(201).json({
      success: true,
      message: `Successfully enrolled ${result.student.name} as ${result.student.studentId} in batch ${result.batch.code}!`,
      data: result,
    });
  } catch (err) {
    console.error('Enrollment Transaction Error:', err.message);
    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message || 'Transaction aborted. No data committed.',
    });
  }
};

/**
 * PATH B: Direct Walk-In Admission (Single Atomic Transaction)
 */
export const directRegister = async (req, res) => {
  const { name, parentName, phone, whatsapp, email, aadhaarNo, courseName, level, batchId, totalFee } = req.body;
  const staffName = req.user?.name || 'Staff';

  if (!name || !phone || !email || !courseName) {
    return res.status(400).json({ success: false, message: 'Missing required student fields (name, phone, email, courseName).' });
  }
  if (!batchId) {
    return res.status(400).json({ success: false, message: 'batchId is required. Direct admission must specify a batch.' });
  }

  try {
    const result = await runWithTransaction(async (session) => {
      // Step 1: Atomic Conditional Batch Reservation & Capacity Enforcement
      const updatedBatch = await Batch.findOneAndUpdate(
        {
          _id: batchId,
          $expr: { $lt: ['$currentEnrolledCount', '$maxStudents'] },
        },
        { $inc: { currentEnrolledCount: 1 } },
        { session, new: true }
      );

      if (!updatedBatch) {
        const batchInfo = await Batch.findById(batchId).session(session);
        const capacityMsg = batchInfo
          ? `Seat no longer available. Batch '${batchInfo.code}' is at full capacity (${batchInfo.currentEnrolledCount}/${batchInfo.maxStudents}).`
          : 'Selected batch does not exist.';
        const err = new Error(capacityMsg);
        err.statusCode = 409;
        throw err;
      }

      // Step 2: Atomic Unique Roll Number Generation
      const studentId = await getNextSequence('student_roll_number', session, 'TELA-2026-', 4);

      // Step 3: Create Student Record (Exact same schema as Path A)
      const [student] = await Student.create(
        [
          {
            studentId,
            enrollmentType: 'Path_B_Direct',
            name,
            parentName: parentName || 'Guardian',
            phone,
            whatsapp: whatsapp || phone,
            email,
            aadhaarNo: aadhaarNo || '',
            courseName,
            level: level || 'A1',
            batchId: updatedBatch._id,
            batchCode: updatedBatch.code,
            teacherName: updatedBatch.teacherName,
            joiningDate: new Date(),
            admissionDate: new Date(),
            status: 'Active',
            verificationStatus: 'Verified',
            timeline: [
              {
                title: 'Direct Walk-In Admission Registered',
                detail: `Direct registration assigned to batch ${updatedBatch.code}. Initial fee ledger created.`,
                by: staffName,
                at: new Date(),
              },
            ],
          },
        ],
        { session }
      );

      // Step 4: Generate Fee Invoice Plan atomically
      const feeAmount = Number(totalFee) || 25000;
      const [fee] = await Fee.create(
        [
          {
            studentId: student._id,
            studentCode: student.studentId,
            studentName: student.name,
            courseName: student.courseName,
            totalFee: feeAmount,
            discount: 0,
            netFee: feeAmount,
            paidTotal: 0,
            remainingTotal: feeAmount,
            status: 'Pending',
            installments: [
              {
                installmentNo: 1,
                amount: Math.round(feeAmount / 2),
                dueDate: new Date(Date.now() + 7 * 86400000),
                paidAmount: 0,
                status: 'Pending',
              },
              {
                installmentNo: 2,
                amount: Math.round(feeAmount / 2),
                dueDate: new Date(Date.now() + 30 * 86400000),
                paidAmount: 0,
                status: 'Pending',
              },
            ],
          },
        ],
        { session }
      );

      // Step 5: Document entry
      if (aadhaarNo) {
        await Document.create(
          [
            {
              studentId: student._id,
              studentCode: student.studentId,
              studentName: student.name,
              type: 'Aadhaar / ID Proof',
              name: `Aadhaar_${student.name.replace(/\s+/g, '_')}.pdf`,
              status: 'Verified',
              uploadedBy: staffName,
            },
          ],
          { session }
        );
      }

      return { student, batch: updatedBatch, fee };
    });

    res.status(201).json({
      success: true,
      message: `Direct walk-in admission complete for ${result.student.name} (${result.student.studentId}) in batch ${result.batch.code}!`,
      data: result,
    });
  } catch (err) {
    console.error('Direct Admission Transaction Error:', err.message);
    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message || 'Transaction aborted. No data committed.',
    });
  }
};

/**
 * ATOMIC BATCH TRANSFER
 * Decrements old batch count, conditionally increments new batch count, updates student's batch.
 */
export const transferBatch = async (req, res) => {
  const { studentId, targetBatchId } = req.body;
  const staffName = req.user?.name || 'Staff';

  if (!studentId || !targetBatchId) {
    return res.status(400).json({ success: false, message: 'studentId and targetBatchId are required.' });
  }

  try {
    const result = await runWithTransaction(async (session) => {
      const student = await Student.findById(studentId).session(session);
      if (!student) throw new Error('Student not found.');

      if (student.batchId && student.batchId.toString() === targetBatchId) {
        throw new Error('Student is already enrolled in this batch.');
      }

      const oldBatchId = student.batchId;

      // Conditional Atomic Increment on Target Batch
      const targetBatch = await Batch.findOneAndUpdate(
        {
          _id: targetBatchId,
          $expr: { $lt: ['$currentEnrolledCount', '$maxStudents'] },
        },
        { $inc: { currentEnrolledCount: 1 } },
        { session, new: true }
      );

      if (!targetBatch) {
        const batchInfo = await Batch.findById(targetBatchId).session(session);
        throw new Error(
          batchInfo
            ? `Cannot transfer: Target batch '${batchInfo.code}' is at full capacity (${batchInfo.currentEnrolledCount}/${batchInfo.maxStudents}).`
            : 'Target batch not found.'
        );
      }

      // Decrement Old Batch Count
      if (oldBatchId) {
        await Batch.findByIdAndUpdate(
          oldBatchId,
          { $inc: { currentEnrolledCount: -1 } },
          { session }
        );
      }

      // Update Student
      const previousBatchCode = student.batchCode;
      student.batchId = targetBatch._id;
      student.batchCode = targetBatch.code;
      student.teacherName = targetBatch.teacherName;
      student.timeline.push({
        title: 'Batch Transfer Executed',
        detail: `Transferred from ${previousBatchCode} to ${targetBatch.code}.`,
        by: staffName,
        at: new Date(),
      });
      await student.save({ session });

      return { student, targetBatch, previousBatchCode };
    });

    res.json({
      success: true,
      message: `Student transferred to ${result.targetBatch.code} successfully!`,
      data: result,
    });
  } catch (err) {
    console.error('Batch Transfer Error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * CONCURRENCY RACE TEST (Section 2 Verification)
 * Simulates two simultaneous requests attempting to book the last seat in a batch.
 */
export const testConcurrencyRace = async (req, res) => {
  const testBatchCode = `RACE-TEST-${Date.now()}`;
  try {
    // Create a 1-seat batch
    const testBatch = await Batch.create({
      code: testBatchCode,
      courseId: new mongoose.Types.ObjectId(),
      courseName: 'Race Test Course',
      level: 'A1',
      room: 'Test Room 99',
      days: ['Mon'],
      timing: '10:00 AM - 11:00 AM',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 86400000),
      maxStudents: 1,
      currentEnrolledCount: 0,
      status: 'Ongoing',
    });

    const enrollCandidate = async (name, email) => {
      return runWithTransaction(async (session) => {
        const updatedBatch = await Batch.findOneAndUpdate(
          {
            _id: testBatch._id,
            $expr: { $lt: ['$currentEnrolledCount', '$maxStudents'] },
          },
          { $inc: { currentEnrolledCount: 1 } },
          { session, new: true }
        );

        if (!updatedBatch) {
          const err = new Error(`Capacity Exceeded! Batch ${testBatch.code} is full (1/1 seats).`);
          err.statusCode = 409;
          throw err;
        }

        const studentId = await getNextSequence('student_roll_number', session, 'TELA-2026-', 4);
        const [student] = await Student.create(
          [
            {
              studentId,
              name,
              phone: '+91 99999 00000',
              whatsapp: '+91 99999 00000',
              email,
              courseName: 'Race Test Course',
              level: 'A1',
              batchId: updatedBatch._id,
              batchCode: updatedBatch.code,
              joiningDate: new Date(),
            },
          ],
          { session }
        );

        return { student, batch: updatedBatch };
      });
    };

    // Fire two simultaneous enrollment requests in parallel
    const [result1, result2] = await Promise.allSettled([
      enrollCandidate('Candidate A (Concurrent)', 'candidate.a@race.test'),
      enrollCandidate('Candidate B (Concurrent)', 'candidate.b@race.test'),
    ]);

    const finalBatch = await Batch.findById(testBatch._id);

    // Clean up test data
    await Student.deleteMany({ batchId: testBatch._id });
    await Batch.findByIdAndDelete(testBatch._id);

    const winner = result1.status === 'fulfilled' ? 'Candidate A' : 'Candidate B';
    const loser = result1.status === 'rejected' ? 'Candidate A' : 'Candidate B';
    const rejectedError = result1.status === 'rejected' ? result1.reason.message : result2.reason.message;

    const testPassed =
      (result1.status === 'fulfilled' && result2.status === 'rejected') ||
      (result2.status === 'fulfilled' && result1.status === 'rejected');

    res.json({
      success: testPassed,
      testName: 'Section 2 Concurrency & Atomic Transaction Verification',
      testPassed,
      summary: testPassed
        ? 'RACE CONDITION PREVENTED: Exactly one transaction succeeded, and the second was safely rejected.'
        : 'RACE CONDITION FAILED: Concurrency violation.',
      batchCapacity: 1,
      finalEnrolledCountObserved: finalBatch ? finalBatch.currentEnrolledCount : 1,
      winner: {
        candidate: winner,
        status: 'Fulfilled (201 Created)',
      },
      rejected: {
        candidate: loser,
        status: 'Rejected (409 Conflict)',
        errorMessage: rejectedError,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * SECTION 10 TRANSACTION ABORT & ROLLBACK VERIFICATION
 * Deliberately throws an error mid-transaction (after incrementing batch count and creating student)
 * and verifies that MongoDB fully rolled back both writes, restoring 100% of the previous state.
 */
export const testAbortRollback = async (req, res) => {
  const testBatchCode = `ABORT-TEST-${Date.now()}`;
  try {
    // 1. Create a clean test batch with 0 enrolled count
    const testBatch = await Batch.create({
      code: testBatchCode,
      courseId: new mongoose.Types.ObjectId(),
      courseName: 'Abort Rollback Course',
      level: 'A1',
      room: 'Test Room 101',
      days: ['Tue'],
      timing: '02:00 PM - 03:00 PM',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 86400000),
      maxStudents: 10,
      currentEnrolledCount: 0,
      status: 'Ongoing',
    });

    let simulatedRollNumber = '';
    let caughtError = null;

    // 2. Execute a transaction that deliberately fails after step 2
    try {
      await runWithTransaction(async (session) => {
        // Step 1: Increment batch count
        await Batch.findByIdAndUpdate(
          testBatch._id,
          { $inc: { currentEnrolledCount: 1 } },
          { session }
        );

        // Step 2: Generate student roll number and create student
        simulatedRollNumber = await getNextSequence('student_roll_number', session, 'TELA-2026-', 4);
        await Student.create(
          [
            {
              studentId: simulatedRollNumber,
              name: 'Rollback Candidate (Simulated Failure)',
              phone: '+91 99999 88888',
              whatsapp: '+91 99999 88888',
              email: 'rollback.candidate@test.com',
              courseName: 'Abort Rollback Course',
              level: 'A1',
              batchId: testBatch._id,
              batchCode: testBatch.code,
              timeline: [
                {
                  title: 'Testing rollback',
                  by: 'Tester',
                  at: new Date(),
                },
              ],
            },
          ],
          { session }
        );

        // Step 3: Deliberate failure triggered mid-flow
        const deliberateFailure = new Error('SIMULATED_FAILURE_AFTER_STEP_2: Deliberately aborting transaction to verify rollback.');
        deliberateFailure.isSimulated = true;
        throw deliberateFailure;
      });
    } catch (err) {
      caughtError = err;
    }

    // 3. Inspect Database State post-abort
    const postAbortBatch = await Batch.findById(testBatch._id);
    const postAbortStudent = await Student.findOne({ studentId: simulatedRollNumber });

    // Clean up temporary batch
    await Batch.findByIdAndDelete(testBatch._id);

    // Rollback is verified if:
    // a) An error was caught
    // b) Batch count was rolled back to 0 (NOT left at 1)
    // c) Student document was rolled back and does NOT exist in DB
    const batchCountRolledBack = postAbortBatch && postAbortBatch.currentEnrolledCount === 0;
    const studentRolledBack = postAbortStudent === null;
    const testPassed = caughtError !== null && batchCountRolledBack && studentRolledBack;

    res.json({
      success: testPassed,
      testName: 'Section 10 Transaction Abort & Zero Partial State Verification',
      testPassed,
      simulatedError: caughtError?.message,
      verification: {
        batchCountBeforeTransaction: 0,
        batchCountAfterAbortedTransaction: postAbortBatch?.currentEnrolledCount,
        studentRecordExistsInDatabase: postAbortStudent !== null,
        rollbackIntegrityConfirmed: testPassed,
      },
      summary: testPassed
        ? 'TRANSACTION ATOMICITY CONFIRMED: Mid-flow error triggered clean abort. Zero orphaned student documents, and batch counter rolled back to initial state.'
        : 'ROLLBACK FAILED: Partial state detected in database.',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

