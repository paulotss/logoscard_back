import { Router } from 'express';
import InvoiceController from '../controllers/invoice.controller';

const router = Router();

router.get('/invoice/:id', (req, res, next) =>
  new InvoiceController(req, res, next).getOne(),
);

router.put('/invoice/update', (req, res, next) =>
  new InvoiceController(req, res, next).update(),
);

router.post('/invoices', (req, res, next) =>
  new InvoiceController(req, res, next).generateInvoices(),
);

router.get('/invoices/paid', (req, res, next) =>
  new InvoiceController(req, res, next).getTotalPaid(),
);

router.get('/invoices/pending', (req, res, next) =>
  new InvoiceController(req, res, next).getTotalPending(),
);

router.get('/invoices/overdue', (req, res, next) =>
  new InvoiceController(req, res, next).getTotalOverdue(),
);

export default router;
