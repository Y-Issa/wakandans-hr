import express from 'express';
import { UserRole } from '@prisma/client';
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  deleteUserTeam,
  getUsersForTeam,
  getTeamsForUser,
  assignUserTeam,
} from '../controllers/teamController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/teams', authMiddleware);
router.use('/userTeams', authMiddleware);

router.get('/teams', authRolesMiddleware([UserRole.ADMIN]), getAllTeams);

router.get('/teams/:id', authRolesMiddleware([UserRole.ADMIN]), getTeamById);

router.post('/teams', authRolesMiddleware([UserRole.ADMIN]), createTeam);

router.put('/teams/:id', authRolesMiddleware([UserRole.ADMIN]), updateTeam);

router.delete('/teams/:id', authRolesMiddleware([UserRole.ADMIN]), deleteTeam);

// userTeamRoutes

router.post(
  '/userTeams',
  authRolesMiddleware([UserRole.ADMIN]),
  assignUserTeam,
);

router.get(
  '/userTeams/user/:userId',
  authRolesMiddleware([UserRole.ADMIN]),
  getTeamsForUser,
);

router.get(
  '/userTeams/team/:teamId',
  authRolesMiddleware([UserRole.ADMIN]),
  getUsersForTeam,
);

router.delete(
  '/userTeams/user/:userId/team/:teamId',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteUserTeam,
);

export default router;
