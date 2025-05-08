import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../user/user.model';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('Authentication token required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { _id: string };
    const user = await User.findOne({ _id: decoded._id, isActive: true });

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Middleware para verificar permisos específicos
export const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.permissions[permission]) {
        throw new Error(`No permission to ${permission}`);
      }
      next();
    } catch (error) {
      res.status(403).send({ error: 'No tienes los permisos necesarios' });
    }
  };
};

// Middleware para validar IDs de MongoDB
export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid ID format' });
  }
  next();
};

// Middleware para manejar errores
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
};

// Middleware para validar datos de entrada
export const validateUserInput = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  if (password.length < 6) {
    return res.status(400).send({ error: 'Password must be at least 6 characters long' });
  }

  if (!email.includes('@')) {
    return res.status(400).send({ error: 'Invalid email format' });
  }

  next();
};

// Middleware para validar datos del libro
export const validateBookInput = (req: Request, res: Response, next: NextFunction) => {
  const { title, author, genre, publisher, publicationDate } = req.body;

  if (!title || !author || !genre || !publisher || !publicationDate) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  if (!Date.parse(publicationDate)) {
    return res.status(400).send({ error: 'Invalid date format' });
  }

  next();
};

// Middleware para registrar las peticiones (logging)
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};