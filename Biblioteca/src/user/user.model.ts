import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permissions: {
    createBooks: { type: Boolean, default: false },
    modifyBooks: { type: Boolean, default: false },
    modifyUsers: { type: Boolean, default: false },
    disableUsers: { type: Boolean, default: false },
    disableBooks: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);