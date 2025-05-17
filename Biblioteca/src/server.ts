import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './user/user.routes';
import bookRoutes from './book/book.routes';

const app = express();

const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use(express.json());
app.use('/users', userRoutes);
app.use('/books', bookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});