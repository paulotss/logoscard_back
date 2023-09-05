import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();

router.get('/user/active/:token', (req, res, next) =>
  new UserController(req, res, next).getCurrentUser(),
);

router.get('/users', (req, res, next) =>
  new UserController(req, res, next).getAll(),
);

router.get('/user/:id', (req, res, next) =>
  new UserController(req, res, next).getOne(),
);

router.post('/user', (req, res, next) =>
  new UserController(req, res, next).create(),
);

router.post('/user/dependent', (req, res, next) =>
  new UserController(req, res, next).createBulkDependent(),
);

router.put('/user/edit', (req, res, next) =>
  new UserController(req, res, next).update(),
);

router.post('/login', (req, res, next) =>
  new UserController(req, res, next).login(),
);

export default router;
