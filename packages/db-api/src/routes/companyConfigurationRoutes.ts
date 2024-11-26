import express from 'express';
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
import { UserRole } from '@prisma/client';

const router = express.Router();

router.use('/company-configurations', authMiddleware);

router.get(
  '/company-configurations',
  authRolesMiddleware([UserRole.ADMIN]),
  getAllCompanyConfigurations,
);

router.get(
  '/company-configurations/:id',
  authRolesMiddleware([UserRole.ADMIN]),
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
