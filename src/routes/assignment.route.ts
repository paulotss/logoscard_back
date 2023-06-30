import { Router } from 'express';
import AssignmentController from '../controllers/assignment.controller';

const router = Router();

router.post('/assignment', (req, res, next) =>
  new AssignmentController(req, res, next).create(),
);

router.delete('/assignment/:id', (req, res, next) =>
  new AssignmentController(req, res, next).remove(),
);

export default router;
