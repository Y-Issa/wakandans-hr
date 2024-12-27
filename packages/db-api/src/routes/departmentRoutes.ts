import express from 'express';
import { UserRole } from '@prisma/client';
import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  DeleteDepartment,
  assignUserDepartment,
  getDepartmentsForUser,
  getUsersForDepartment,
  deleteUserDepartment,
  getUsersCountForDepartment,
} from '../controllers/departmentController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/departments', authMiddleware);
router.use('/userDepartments', authMiddleware);

router.get(
  '/departments',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),

  getAllDepartments,
);

router.get(
  '/departments/:id',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),

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

router.delete(
  '/departments/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  DeleteDepartment,
);

// userDepartmentRoutes
router.post(
  '/userDepartments',
  authRolesMiddleware([UserRole.ADMIN]),
  assignUserDepartment,
);

router.get(
  '/userDepartments/user/:userId',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),

  getDepartmentsForUser,
);

router.get(
  '/userDepartments/department/:departmentId',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),

  getUsersForDepartment,
);

router.get(
  '/userDepartments/department/user-count/:departmentId',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  getUsersCountForDepartment,
);

router.delete(
  '/userDepartments/user/:userId/department/:departmentId',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteUserDepartment,
);

export default router;
