import { Router } from 'express';
import BenefitController from '../controllers/benefit.controller';

const router = Router();

router.post('/assignment/benefit', (req, res, next) =>
  new BenefitController(req, res, next).addBenefitToAssignment(),
);

export default router;
