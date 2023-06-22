import { Router } from 'express';
import multer from 'multer';
import UserController from '../controllers/user.controller';
import MulterStorage from '../utils/MulterStorage';

const router = Router();

router.get('/users', (req, res, next) =>
  new UserController(req, res, next).getAll(),
);

router.get('/user/:id', (req, res, next) =>
  new UserController(req, res, next).getOne(),
);

router.post(
  '/user',
  multer(new MulterStorage().multerConfig()).single('file'),
  (req, res, next) => new UserController(req, res, next).create(),
);

export default router;
