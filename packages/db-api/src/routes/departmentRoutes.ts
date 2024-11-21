import express from 'express';
import { UserRole } from '@prisma/client';
import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  softDeleteDepartment,
} from '../controllers/departmentController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/departments', authMiddleware);

router.get(
  '/departments',
  authRolesMiddleware([UserRole.ADMIN]),
  getAllDepartments,
);

router.get(
  '/departments/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  getDepartmentById,
);

router.post(
  '/departments',
  authRolesMiddleware([UserRole.ADMIN]),
  createDepartment,
);

router.put(
  '/departments/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  updateDepartment,
);

router.patch(
  '/departments/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  softDeleteDepartment,
);

export default router;
