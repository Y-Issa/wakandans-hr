import express from 'express';
import { UserRole } from '@prisma/client';
import {
  assignUserGroup,
  getGroupsForUser,
  getUsersForGroup,
  deleteUserGroup,
} from '../controllers/userGroupController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/userGroups', authMiddleware);

router.post(
  '/userGroups',
  authRolesMiddleware([UserRole.ADMIN]),
  assignUserGroup,
);

router.get(
  '/userGroups/user/:userId',
  authRolesMiddleware([UserRole.ADMIN]),
  getGroupsForUser,
);

router.get(
  '/userGroups/group/:groupId',
  authRolesMiddleware([UserRole.ADMIN]),
  getUsersForGroup,
);

router.delete(
  '/userGroups/user/:userId/group/:groupId',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteUserGroup,
);

export default router;
