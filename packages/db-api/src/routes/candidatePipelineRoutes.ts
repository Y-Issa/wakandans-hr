// src/routes/candidatePipelineRoutes.ts
import express from 'express';
import {
  moveToStage,
  getCandidatesByStage,
  getStageHistory,
} from '../controllers/candidatePipelineController';

const router = express.Router();

// Move a candidate to a new stage
router.put('/candidates/:id/stage', moveToStage);

// Get all candidates grouped by stage
router.get('/candidates/by-stage', getCandidatesByStage);

// Get stage history for a candidate
router.get('/candidates/:id/history', getStageHistory);

export default router;
