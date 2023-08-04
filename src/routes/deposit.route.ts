import { Router } from 'express';
import DepositController from '../controllers/deposit.controller';

const router = Router();

router.get('/deposit', (req, res, next) =>
  new DepositController(req, res, next).totalAmount(),
);

router.post('/deposit', (req, res, next) =>
  new DepositController(req, res, next).create(),
);

export default router;
