import { Router } from 'express';
import PlanController from '../controllers/plan.controller';

const router = Router();

router.get('/plans', (req, res, next) =>
  new PlanController(req, res, next).getAll(),
);

export default router;
