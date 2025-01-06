import { Router } from 'express';
import PagBankController from '../controllers/pagBank.controller';

const router = Router();

router.post('/orders', (req, res, next) =>
    new PagBankController(req, res, next).create(),
  );

router.get('/orders/:order_id', (req, res, next) =>
    new PagBankController(req, res, next).get(),
  );

  export default router
