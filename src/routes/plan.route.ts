import { Router } from 'express';
import PlanController from '../controllers/plan.controller';
import UserPlanController from '../controllers/userPlan.controller';

const router = Router();

router.get('/plans', (req, res, next) =>
  new PlanController(req, res, next).getAll(),
);

router.delete('/plan', (req, res, next) =>
  new UserPlanController(req, res, next).removePlan(),
);

router.get('/plan/:id', (req, res, next) =>
  new PlanController(req, res, next).getById(),
);

export default router;
