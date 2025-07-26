import { Request, Response, NextFunction } from 'express';
import AssignmentService from '../services/assignment.service';

class AssignmentController {
  private request: Request;

  private response: Response;

  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }

  public async create() {
    const { expiration, planId, userId, pagbankSubscriptionId } = this.request.body;
    try {
      const result = await AssignmentService.create(
        Number(planId),
        Number(userId),
        pagbankSubscriptionId,
        expiration,
      );
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async remove() {
    const { id } = this.request.params;
    try {
      const result = await AssignmentService.remove(Number(id));
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async syncInvoices() {
    try {
      // 1. Pega o ID do assignment que vem pela URL (ex: /assignments/123/sync-invoices)
      const { id } = this.request.params;

      // 2. Chama o serviço que fará a lógica de sincronização, passando o ID
      await AssignmentService.syncInvoices(Number(id));

      // 3. Retorna uma resposta de sucesso para o frontend
      this.response.status(200).json({ message: 'Faturas sincronizadas com sucesso.' });
    } catch (error) {
      // Se algo der errado no serviço, o erro é capturado e passado para o middleware de erro
      this.next(error);
    }
  }
}

export default AssignmentController;
