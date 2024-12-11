import express from 'express';
import {
  getAllCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from '../controllers/candidateController';

const router = express.Router();

// router.use('/candidates', authMiddleware);

router.get(
  '/candidates',
  //   authRolesMiddleware([UserRole.ADMIN]),
  getAllCandidates,
);

router.get(
  '/candidates/:id',
  //   authRolesMiddleware([UserRole.ADMIN]),
  getCandidateById,
);

router.post(
  '/candidates',
  //   authRolesMiddleware([UserRole.ADMIN]),
  createCandidate,
);

router.put(
  '/candidates/:id',
  //   authRolesMiddleware([UserRole.ADMIN]),
  updateCandidate,
);

router.delete(
  '/candidates/:id',
  //   authRolesMiddleware([UserRole.ADMIN]),
  deleteCandidate,
);

export default router;
