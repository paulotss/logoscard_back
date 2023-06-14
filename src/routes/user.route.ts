import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();

router.get('/users', (req, res, next) =>
  new UserController(req, res, next).getAll(),
);

router.get('/user/:id', (req, res, next) =>
  new UserController(req, res, next).getOne(),
);

export default router;
