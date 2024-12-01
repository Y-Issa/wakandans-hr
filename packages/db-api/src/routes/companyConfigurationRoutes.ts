import express from 'express';
import { UserRole } from '@prisma/client';
import {
  getAllCompanyConfigurations,
  getCompanyConfigurationById,
  createCompanyConfiguration,
  updateCompanyConfiguration,
  deleteCompanyConfiguration,
} from '../controllers/companyConfigurationController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/company-configurations', authMiddleware);

router.get(
  '/company-configurations',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  getAllCompanyConfigurations,
);

router.get(
  '/company-configurations/:id',
  authRolesMiddleware([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.MANAGER]),
  getCompanyConfigurationById,
);

router.post(
  '/company-configurations',
  authRolesMiddleware([UserRole.ADMIN]),
  createCompanyConfiguration,
);

router.put(
  '/company-configurations/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  updateCompanyConfiguration,
);

router.delete(
  '/company-configurations/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteCompanyConfiguration,
);

export default router;
