import { Request, Response, NextFunction } from 'express';
import ClientService from '../services/client.service';
import IUser from '../interfaces/IUser';

class ClientController {
  private request: Request;

  private response: Response;

  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }

  public async getAll() {
    try {
      const result = await ClientService.getAll();
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async getTotal() {
    try {
      const result = await ClientService.getTotal();
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async create() {
    const user: IUser = this.request.body;
    try {
      const result = await ClientService.create(user);
      this.response.status(201).json(result);
    } catch (error) {
      this.next(error);
    }
  }
}

export default ClientController;
