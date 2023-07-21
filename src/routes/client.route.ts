import { Router } from 'express';
import ClientController from '../controllers/client.controller';

const router = Router();

router.get('/clients', (req, res, next) =>
  new ClientController(req, res, next).getAll(),
);

export default router;
