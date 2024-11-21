import express from 'express';
import { UserRole } from '@prisma/client';
import {
  assignUserDepartment,
  getDepartmentsForUser,
  getUsersForDepartment,
  deleteUserDepartment,
} from '../controllers/userDepartmentController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/userDepartments', authMiddleware);

router.post(
  '/userDepartments',
  authRolesMiddleware([UserRole.ADMIN]),
  assignUserDepartment,
);

router.get(
  '/userDepartments/user/:userId',
  authRolesMiddleware([UserRole.ADMIN]),
  getDepartmentsForUser,
);

router.get(
  '/userDepartments/department/:departmentId',
  authRolesMiddleware([UserRole.ADMIN]),
  getUsersForDepartment,
);

router.delete(
  '/userDepartments/user/:userId/department/:departmentId',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteUserDepartment,
);

export default router;
