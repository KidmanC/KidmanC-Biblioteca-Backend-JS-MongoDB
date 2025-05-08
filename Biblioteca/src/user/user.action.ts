import { User } from './user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Reservation } from '../reservation/reservation.model';

export class UserActions {
  static async createUser(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 8);
    const user = new User({
      ...userData,
      password: hashedPassword
    });
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'secret');
    return { user, token };
  }

  static async loginUser(email: string, password: string) {
    const user = await User.findOne({ email, isActive: true });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'secret');
    return { user, token };
  }

  static async updateUser(userId: string, updateData: any, requestingUser: any) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (!requestingUser.permissions.modifyUsers && requestingUser._id.toString() !== userId) {
      throw new Error('No permission to modify this user');
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 8);
    }

    Object.assign(user, updateData);
    await user.save();
    return user;
  }

  static async deleteUser(userId: string, requestingUser: any) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (!requestingUser.permissions.disableUsers && requestingUser._id.toString() !== userId) {
      throw new Error('No permission to disable this user');
    }

    user.isActive = false;
    await user.save();
    return user;
  }

  static async getUserReservationHistory(userId: string) {
    return await Reservation.find({ userId })
      .populate('bookId')
      .sort({ reservationDate: -1 });
  }
}