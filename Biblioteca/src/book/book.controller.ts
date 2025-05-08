import { Request, Response } from 'express';
import { BookActions } from './book.action';
import { Book } from './book.model'; 
import { Reservation } from '../reservation/reservation.model'; 

export class BookController {
  static async createBook(req: Request, res: Response) {
    try {
      if (!req.user.permissions.createBooks) {
        return res.status(403).send({ error: 'No permission' });
      }
      const book = await BookActions.createBook(req.body);
      res.status(201).send(book);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async getBook(req: Request, res: Response) {
    try {
      const book = await BookActions.getBookById(req.params.id);
      if (!book) return res.status(404).send();
      res.send(book);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async getBooks(req: Request, res: Response) {
    try {
      const books = await BookActions.getBooks(req.query);
      res.send(books);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async updateBook(req: Request, res: Response) {
    try {
      const book = await BookActions.updateBook(req.params.id, req.body, req.user);
      res.send(book);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async deleteBook(req: Request, res: Response) {
    try {
      const book = await BookActions.deleteBook(req.params.id, req.user);
      res.send(book);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async getBookReservations(req: Request, res: Response) {
    try {
      const reservations = await BookActions.getBookReservationHistory(req.params.id);
      res.send(reservations);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async createReservation(req: Request, res: Response) {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send({ error: 'Book not found' });
        }

        if (!book.available) {
            return res.status(400).send({ error: 'Book is not available' });
        }

        const reservation = new Reservation({
            userId: req.user._id,  
            bookId: req.params.id,
            returnDate: new Date(req.body.returnDate)
        });

        await reservation.save();

        book.available = false;
        await book.save();

        res.status(201).send(reservation);
    } catch (error) {
        res.status(400).send(error);
    }
}

}