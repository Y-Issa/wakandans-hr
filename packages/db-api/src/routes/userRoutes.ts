import express from 'express';
import { UserRole } from '@prisma/client';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  DeleteUser,
  getManagementUsers,
} from '../controllers/userController';
import {
  // authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.get(
  '/users',
  // authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  getAllUsers,
);

router.get('/users/management', getManagementUsers);

router.get(
  '/users/:id',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  getUserById,
);

router.post('/users', authRolesMiddleware([UserRole.ADMIN]), createUser);

router.put('/users/:id', authRolesMiddleware([UserRole.ADMIN]), updateUser);

router.delete('/users/:id', authRolesMiddleware([UserRole.ADMIN]), DeleteUser);

export default router;
