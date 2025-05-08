import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    reservationDate: { type: Date, default: Date.now },
    returnDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'returned', 'overdue'], default: 'active' }
  });
  
  export const Reservation = mongoose.model('Reservation', reservationSchema);