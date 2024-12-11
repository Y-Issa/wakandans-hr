import express from 'express';
import { UserRole } from '@prisma/client';
import {
  getAllWorkSettings,
  getWorkSettingById,
  createWorkSetting,
  updateWorkSetting,
  deleteWorkSetting,
} from '../controllers/workSettingController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/work-settings', authMiddleware);

router.get(
  '/work-settings',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  getAllWorkSettings,
);

router.get(
  '/work-settings/:id',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  getWorkSettingById,
);

router.post(
  '/work-settings',
  authRolesMiddleware([UserRole.ADMIN]),
  createWorkSetting,
);

router.put(
  '/work-settings/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  updateWorkSetting,
);

router.delete(
  '/work-settings/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteWorkSetting,
);

export default router;
