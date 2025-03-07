import { Router } from 'express';
import PagBankController from '../controllers/pagBank.controller';

const router = Router();

router.post('/orders', (req, res, next) =>
    new PagBankController(req, res, next).create(),
  );

router.get('/orders/:order_id', (req, res, next) =>
    new PagBankController(req, res, next).get(),
  );

router.post('/signature/plans', (req, res, next) =>
  new PagBankController(req, res, next).createPlans(),
);

    router.post('/signature/customers', (req, res, next) => {
      new PagBankController(req, res, next).createUser(),
      console.log(req.body);
    }
  
);

router.post('/signature/subscription', (req, res, next) => 
  new PagBankController(req, res, next).createSignature(),
);

export default router;

