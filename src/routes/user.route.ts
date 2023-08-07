import { Router } from 'express';
import multer from 'multer';
import UserController from '../controllers/user.controller';
import MulterStorage from '../utils/MulterStorage';

const router = Router();
const multerStorage = new MulterStorage(Date.now().toString());

router.get('/user/:token', (req, res, next) =>
  new UserController(req, res, next).getCurrentUser(),
);

router.get('/users', (req, res, next) =>
  new UserController(req, res, next).getAll(),
);

router.get('/user/:id', (req, res, next) =>
  new UserController(req, res, next).getOne(),
);

router.post(
  '/user',
  multer(multerStorage.multerConfig()).single('file'),
  (req, res, next) =>
    new UserController(req, res, next).create(multerStorage.getName()),
);

router.post('/user/dependent', (req, res, next) =>
  new UserController(req, res, next).createBulkDependent(),
);

export default router;
