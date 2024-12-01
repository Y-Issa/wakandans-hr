import express from 'express';
import { UserRole } from '@prisma/client';
import {
  getAllCompanyConfigurations,
  getCompanyConfigurationById,
  createCompanyConfiguration,
  updateCompanyConfiguration,
  deleteCompanyConfiguration,
  getAllCompanyConfigurationDayOffs,
  getCompanyConfigurationDayOffById,
  createCompanyConfigurationDayOff,
  updateCompanyConfigurationDayOff,
  deleteCompanyConfigurationDayOff,
} from '../controllers/companyConfigurationController';
import {
  authMiddleware,
  authRolesMiddleware,
} from '../middlewares/authMiddleware';

const router = express.Router();

router.use('/company-configurations', authMiddleware);
router.use('/company-configuration-day-offs', authMiddleware);

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

// companyConfigDayOff
router.get(
  '/company-configuration-day-offs',
  authRolesMiddleware([UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE]),
  getAllCompanyConfigurationDayOffs,
);

router.get(
  '/company-configuration-day-offs/:id',
  authRolesMiddleware([UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE]),
  getCompanyConfigurationDayOffById,
);

router.post(
  '/company-configuration-day-offs',
  authRolesMiddleware([UserRole.ADMIN]),
  createCompanyConfigurationDayOff,
);

router.put(
  '/company-configuration-day-offs/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  updateCompanyConfigurationDayOff,
);

router.delete(
  '/company-configuration-day-offs/:id',
  authRolesMiddleware([UserRole.ADMIN]),
  deleteCompanyConfigurationDayOff,
);

export default router;
