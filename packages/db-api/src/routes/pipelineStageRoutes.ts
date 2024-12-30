// src/routes/pipelineStageRoutes.ts
import express from 'express';
import {
  getAllStages,
  getStageDetails,
  reorderStages,
} from '../controllers/pipelineStageController';

const router = express.Router();

// Get all pipeline stages
router.get('/pipeline-stages', getAllStages);

// Get specific stage details
router.get('/pipeline-stages/:id', getStageDetails);

// Reorder pipeline stages
router.put('/pipeline-stages/reorder', reorderStages);

export default router;
