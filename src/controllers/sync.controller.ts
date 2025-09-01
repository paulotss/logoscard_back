import { Request, Response, NextFunction } from 'express';
import SyncService from '../services/sync.service';

class SyncController {
  private request: Request;
  private response: Response;
  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }

  public async syncInvoicesBySubscription() {
    try {
      const { pagbankSubscriptionId } = this.request.body;

      if (!pagbankSubscriptionId) {
        return this.response
          .status(400)
          .json({ message: 'pagbankSubscriptionId is required.' });
      }

      const result = await SyncService.syncInvoicesBySubscriptionId(
        pagbankSubscriptionId,
      );

      this.response.status(200).json({
        message: 'Sincronização de faturas concluída.',
        ...result,
      });
    } catch (error) {
      this.next(error);
    }
  }
}

export default SyncController;
