import express from 'express';
import { UserRole } from '@prisma/client';
import {
  getAllDayOffs,
  getDayOffById,
  createDayOff,
  updateDayOff,
  deleteDayOff,
} from '../controllers/dayOffController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/day-offs', authMiddleware);

router.get(
  '/day-offs',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  getAllDayOffs,
);

router.get(
  '/day-offs/:id',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  getDayOffById,
);

router.post('/day-offs', authRolesMiddleware([UserRole.ADMIN]), createDayOff);

router.put(
  '/day-offs/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  updateDayOff,
);

router.delete(
  '/day-offs/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteDayOff,
);

export default router;
