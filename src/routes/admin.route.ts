import { Router } from 'express';
import AdminController from '../controllers/admin.controller';

const router = Router();

router.post('/login', (req, res, next) =>
  new AdminController(req, res, next).login(),
);

export default router;
