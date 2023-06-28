import { Router } from 'express';
import PlanController from '../controllers/plan.controller';

const router = Router();

router.get('/plans', (req, res, next) =>
  new PlanController(req, res, next).getAll(),
);

router.get('/plan/:id', (req, res, next) =>
  new PlanController(req, res, next).getById(),
);

export default router;
