import { Router } from 'express';
import InvoiceController from '../controllers/invoice.controller';

const router = Router();

router.get('/invoice/:id', (req, res, next) =>
  new InvoiceController(req, res, next).getOne(),
);

router.put('/invoice/pay', (req, res, next) =>
  new InvoiceController(req, res, next).pay(),
);

router.post('/invoices', (req, res, next) =>
  new InvoiceController(req, res, next).generateInvoices(),
);

router.get('/invoices/total/paid', (req, res, next) =>
  new InvoiceController(req, res, next).getTotalPaid(),
);

router.get('/invoices/total/pending', (req, res, next) =>
  new InvoiceController(req, res, next).getTotalPending(),
);

export default router;
