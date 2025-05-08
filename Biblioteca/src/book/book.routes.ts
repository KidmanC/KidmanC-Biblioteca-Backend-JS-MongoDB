import express from 'express';
import { BookController } from './book.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', auth, BookController.createBook);
router.get('/', BookController.getBooks);
router.get('/:id', BookController.getBook);
router.put('/:id', auth, BookController.updateBook);
router.delete('/:id', auth, BookController.deleteBook);
router.get('/:id/reservations', auth, BookController.getBookReservations);
router.post('/:id/reserve', auth, BookController.createReservation);

export default router;