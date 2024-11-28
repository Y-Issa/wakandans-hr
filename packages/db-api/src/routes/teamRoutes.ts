import express from 'express';
import { UserRole } from '@prisma/client';
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} from '../controllers/teamController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/teams', authMiddleware);

router.get('/teams', authRolesMiddleware([UserRole.ADMIN]), getAllTeams);

router.get('/teams/:id', authRolesMiddleware([UserRole.ADMIN]), getTeamById);

router.post('/teams', authRolesMiddleware([UserRole.ADMIN]), createTeam);

router.put('/teams/:id', authRolesMiddleware([UserRole.ADMIN]), updateTeam);

router.delete('/teams/:id', authRolesMiddleware([UserRole.ADMIN]), deleteTeam);

export default router;
