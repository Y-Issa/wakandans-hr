import express from 'express';
import { UserRole } from '@prisma/client';
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  assignUserGroup,
  getGroupsForUser,
  getUsersForGroup,
  deleteUserGroup,
} from '../controllers/groupController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/groups', authMiddleware);
router.use('/userGroups', authMiddleware);

router.get(
  '/groups',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  getAllGroups,
);

router.get(
  '/groups/:id',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  getGroupById,
);

router.post('/groups', authRolesMiddleware([UserRole.ADMIN]), createGroup);

router.put('/groups/:id', authRolesMiddleware([UserRole.ADMIN]), updateGroup);

router.delete(
  '/groups/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteGroup,
);

// userGroupRoutes
router.post(
  '/userGroups',
  authRolesMiddleware([UserRole.ADMIN]),
  assignUserGroup,
);

router.get(
  '/userGroups/user/:userId',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  getGroupsForUser,
);

router.get(
  '/userGroups/group/:groupId',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  getUsersForGroup,
);

router.delete(
  '/userGroups/user/:userId/group/:groupId',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteUserGroup,
);

export default router;
