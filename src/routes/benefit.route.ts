import { Router } from 'express';
import BenefitController from '../controllers/benefit.controller';
import BenefitNoteController from '../controllers/benefit.note.controller';

const router = Router();

router.post('/assignment/benefit', (req, res, next) =>
  new BenefitController(req, res, next).addBenefitToAssignment(),
);

router.put('/assignment/benefit', (req, res, next) =>
  new BenefitController(req, res, next).updateAmountBenefitToAssignment(),
);

router.post('/benefit/note', (req, res, next) =>
  new BenefitNoteController(req, res, next).create(),
);

export default router;
