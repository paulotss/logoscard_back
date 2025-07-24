import { Router } from 'express';
import PagBankController from '../controllers/pagBank.controller';

const router = Router();


// -- Rotas relacionadas a ordens --

router.post('/orders', (req, res, next) =>
    new PagBankController(req, res, next).create(),
  );

router.get('/orders/:order_id', (req, res, next) =>
    new PagBankController(req, res, next).get(),
  );


  // -- Rotas relacionadas a assinatura recorrente --

  // -- Consultar --
  router.get('/plans', (req, res, next) => {
    new PagBankController(req, res, next).getPlans()
  });

  router.get('/customers', (req, res, next) => {
    new PagBankController(req, res, next).getCustomers()
  });

  router.get('/customers/:cpf', (req, res, next) => {
    new PagBankController(req, res, next).getByCpf()
  });

  router.get('/subscriptions', (req, res, next) => {
    new PagBankController(req, res, next).getSubscriptions()
  });

  router.get('/subscriptions/:subscriptionId', (req, res, next) => {
    new PagBankController(req, res, next).getInvoices()
  });

  router.get('/public-key', (req, res, next) =>
    new PagBankController(req, res, next).getPublicKey()
 );

  // -- Criar --
router.post('/signature/plans', (req, res, next) =>
  new PagBankController(req, res, next).createPlans(),
);

router.post('/signature/customers', (req, res, next) => 
  new PagBankController(req, res, next).createUser(),
);

router.post('/signature/subscription', (req, res, next) => 
  new PagBankController(req, res, next).createSignature(),
);

// -- webhook --
router.post('/webhooks/pagbank', (req, res, next) => 
  new PagBankController(req, res, next).handleWebhook()
);

// -- Cancelar --
router.put('/subscriptions/:subscriptionId', (req, res, next) => {
  new PagBankController(req, res, next).cancelSubscription()
});

export default router;