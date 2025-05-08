import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publisher: { type: String, required: true },
    publicationDate: { type: Date, required: true },
    available: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }
  }, { timestamps: true });
  
  export const Book = mongoose.model('Book', bookSchema);