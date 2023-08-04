import { Router } from 'express';
import WithdrawController from '../controllers/withdraw.controller';

const router = Router();

router.get('/withdraw', (req, res, next) =>
  new WithdrawController(req, res, next).totalAmount(),
);

router.post('/withdraw', (req, res, next) =>
  new WithdrawController(req, res, next).create(),
);

router.get('/withdraws', (req, res, next) =>
  new WithdrawController(req, res, next).getAll(),
);

export default router;
