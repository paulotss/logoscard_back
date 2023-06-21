import { Router } from 'express';
import InvoiceController from '../controllers/invoice.controller';

const router = Router();

router.get('/invoice/:id', (req, res, next) =>
  new InvoiceController(req, res, next).getOne(),
);

export default router;
