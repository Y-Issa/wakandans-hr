import express from 'express';
import { UserRole } from '@prisma/client';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  DeleteUser,
} from '../controllers/userController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/users', authMiddleware);

router.get('/users', authRolesMiddleware([UserRole.ADMIN]), getAllUsers);

router.get('/users/:id', authRolesMiddleware([UserRole.ADMIN]), getUserById);

router.post('/users', authRolesMiddleware([UserRole.ADMIN]), createUser);

router.put('/users/:id', authRolesMiddleware([UserRole.ADMIN]), updateUser);

router.delete('/users/:id', authRolesMiddleware([UserRole.ADMIN]), DeleteUser);

export default router;
