import express from 'express';
import {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} from '../controllers/profileController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.use('/profiles', authMiddleware);

router.get(
  '/profiles',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  getAllProfiles,
);

router.get(
  '/profiles/:id',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  getProfileById,
);

router.post('/profiles', authRolesMiddleware([UserRole.ADMIN]), createProfile);

router.put(
  '/profiles/:id',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  updateProfile,
);

router.delete(
  '/profiles/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteProfile,
);

export default router;
