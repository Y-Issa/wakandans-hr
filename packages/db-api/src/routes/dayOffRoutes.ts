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

router.use('/dayoffs', authMiddleware);

router.get('/dayoffs', authRolesMiddleware([UserRole.ADMIN]), getAllDayOffs);

router.get(
  '/dayoffs/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  getDayOffById,
);

router.post('/dayoffs', authRolesMiddleware([UserRole.ADMIN]), createDayOff);

router.put('/dayoffs/:id', authRolesMiddleware([UserRole.ADMIN]), updateDayOff);

router.delete(
  '/dayoffs/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteDayOff,
);

export default router;
