import { Router } from 'express';
import ClientController from '../controllers/client.controller';

const router = Router();

router.get('/clients', (req, res, next) =>
  new ClientController(req, res, next).getAll(),
);

router.get('/clients/total', (req, res, next) =>
  new ClientController(req, res, next).getTotal(),
);

router.post('/client', (req, res, next) =>
  new ClientController(req, res, next).create(),
);

export default router;
