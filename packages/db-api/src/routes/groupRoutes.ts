import express from 'express';
import { UserRole } from '@prisma/client';
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
} from '../controllers/groupController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/groups', authMiddleware);

router.get('/groups', authRolesMiddleware([UserRole.ADMIN]), getAllGroups);

router.get('/groups/:id', authRolesMiddleware([UserRole.ADMIN]), getGroupById);

router.post('/groups', authRolesMiddleware([UserRole.ADMIN]), createGroup);

router.put('/groups/:id', authRolesMiddleware([UserRole.ADMIN]), updateGroup);

router.delete(
  '/groups/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteGroup,
);

export default router;
