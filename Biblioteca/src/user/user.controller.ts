import { Request, Response } from 'express';
import { UserActions } from './user.action';

export class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const result = await UserActions.createUser(req.body);
      res.status(201).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async loginUser(req: Request, res: Response) {
    try {
      const result = await UserActions.loginUser(req.body.email, req.body.password);
      res.send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const user = await UserActions.updateUser(req.params.id, req.body, req.user);
      res.send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const user = await UserActions.deleteUser(req.params.id, req.user);
      res.send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async getUserReservations(req: Request, res: Response) {
    try {
      const reservations = await UserActions.getUserReservationHistory(req.params.id);
      res.send(reservations);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}