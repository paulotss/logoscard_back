import { Router } from 'express';
import multer from 'multer';
import ClientController from '../controllers/client.controller';
import MulterStorage from '../utils/MulterStorage';

const router = Router();
const multerStorage = new MulterStorage(Date.now().toString());

router.get('/clients', (req, res, next) =>
  new ClientController(req, res, next).getAll(),
);

router.get('/clients/total', (req, res, next) =>
  new ClientController(req, res, next).getTotal(),
);

router.post(
  '/client',
  multer(multerStorage.multerConfig()).single('file'),
  (req, res, next) =>
    new ClientController(req, res, next).create(multerStorage.getName()),
);

export default router;
