import { Book } from './book.model';
import { Reservation } from '../reservation/reservation.model';

export class BookActions {
  static async createBook(bookData: any) {
    const book = new Book(bookData);
    await book.save();
    return book;
  }

  static async getBookById(bookId: string) {
    return await Book.findOne({ _id: bookId, isActive: true });
  }

  static async getBooks(filters: any = {}) {
    const query: any = { isActive: true };
    
    if (filters.genre) query.genre = filters.genre;
    if (filters.author) query.author = filters.author;
    if (filters.publisher) query.publisher = filters.publisher;
    if (filters.available !== undefined) query.available = filters.available;
    if (filters.publicationDate) query.publicationDate = filters.publicationDate;
    if (filters.title) query.title = { $regex: filters.title, $options: 'i' };

    return await Book.find(query);
  }

  static async updateBook(bookId: string, updateData: any, user: any) {
    const book = await Book.findById(bookId);
    if (!book) throw new Error('Book not found');

    if (!user.permissions.modifyBooks) {
      throw new Error('No permission to modify books');
    }

    Object.assign(book, updateData);
    await book.save();
    return book;
  }

  static async deleteBook(bookId: string, user: any) {
    const book = await Book.findById(bookId);
    if (!book) throw new Error('Book not found');

    if (!user.permissions.disableBooks) {
      throw new Error('No permission to disable books');
    }

    book.isActive = false;
    await book.save();
    return book;
  }

  static async getBookReservationHistory(bookId: string) {
    return await Reservation.find({ bookId })
      .populate('userId')
      .sort({ reservationDate: -1 });
  }
}