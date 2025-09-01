import { Router } from 'express';
import SyncController from '../controllers/sync.controller';
import SecurityMiddleware from '../middlewares/SecurityMiddleware';

const syncRouter = Router();

syncRouter.post(
  '/sync/invoices',
  SecurityMiddleware.authenticate,
  SecurityMiddleware.requireAdmin,
  (req, res, next) =>
    new SyncController(req, res, next).syncInvoicesBySubscription(),
);

export default syncRouter;
