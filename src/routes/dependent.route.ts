import { Router } from 'express';
import DependentController from '../controllers/dependent.controller';

const router = Router();

router.get('/dependent/:id', (req, res, next) =>
  new DependentController(req, res, next).getOne(),
);

router.get('/dependents', (req, res, next) =>
  new DependentController(req, res, next).getAll(),
);

router.get('/dependents/total', (req, res, next) =>
  new DependentController(req, res, next).getTotal(),
);

export default router;
