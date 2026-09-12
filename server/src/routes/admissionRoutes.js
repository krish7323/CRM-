import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import { requireRoles } from '../middleware/rbac.js';
import {
  enrollLead,
  directRegister,
  transferBatch,
  testConcurrencyRace,
  testAbortRollback,
} from '../controllers/admissionController.js';

const router = express.Router();

/* All routes require active authentication */
router.use(authenticateJWT);

/**
 * Path A: Convert Interested Lead to Enrolled Student (Atomic Transaction)
 */
router.post('/enroll-lead', requireRoles(['Owner', 'Admin', 'Owner/Admin', 'Counsellor']), enrollLead);

/**
 * Path B: Direct Walk-in Admission (Atomic Transaction)
 */
router.post('/direct-register', requireRoles(['Owner', 'Admin', 'Owner/Admin', 'Counsellor']), directRegister);

/**
 * Batch Transfer (Atomic Transaction)
 */
router.post('/transfer-batch', requireRoles(['Owner', 'Admin', 'Owner/Admin', 'Counsellor']), transferBatch);

/**
 * Concurrency Race Condition Test (Section 2 Verification)
 */
router.all('/race-test', requireRoles(['Owner', 'Admin', 'Owner/Admin']), testConcurrencyRace);

/**
 * Transaction Abort & Rollback Test (Section 10 Verification)
 */
router.all('/test-abort-rollback', requireRoles(['Owner', 'Admin', 'Owner/Admin']), testAbortRollback);

export default router;
