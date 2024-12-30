import express from 'express';
import {
  getAllInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
  getInterviewsByDateRange,
  getInterviewTypes,
} from '../controllers/interviewController';

const router = express.Router();

// Get all interviews with pagination
router.get('/interviews', getAllInterviews);

router.get('/interviews/types', getInterviewTypes);

// Get interviews within a date range
router.get('/interviews/calendar', getInterviewsByDateRange);

// Get specific interview details
router.get('/interviews/:id', getInterviewById);

// Create new interview
router.post('/interviews', createInterview);

// Update interview
router.put('/interviews/:id', updateInterview);

export default router;
