import { Request, Response, NextFunction } from 'express';
import ClientService from '../services/client.service';

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
}

export default ClientController;
