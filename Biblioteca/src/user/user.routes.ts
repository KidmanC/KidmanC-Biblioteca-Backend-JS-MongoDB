import express from 'express';
import { UserController } from './user.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', UserController.createUser);
router.post('/login', UserController.loginUser);
router.put('/:id', auth, UserController.updateUser);
router.delete('/:id', auth, UserController.deleteUser);
router.get('/:id/reservations', auth, UserController.getUserReservations);

export default router;