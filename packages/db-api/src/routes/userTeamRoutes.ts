import express from 'express';
import { UserRole } from '@prisma/client';
import {
  assignUserTeam,
  getTeamsForUser,
  getUsersForTeam,
  deleteUserTeam,
} from '../controllers/userTeamController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/userTeams', authMiddleware);

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
