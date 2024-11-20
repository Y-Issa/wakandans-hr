import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  softDeleteUser,
} from '../controllers/userController';

const router = express.Router();

router.get('/users', getAllUsers);

router.get('/users/:id', getUserById);

router.post('/users', createUser);

router.put('/users/:id', updateUser);

router.patch('/users/:id', softDeleteUser);

export default router;
