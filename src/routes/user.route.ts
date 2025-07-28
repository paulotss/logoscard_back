import { Router } from 'express';
import UserController from '../controllers/user.controller';
import SecurityMiddleware from '../middlewares/SecurityMiddleware';

const router = Router();

router.get(
  '/user/active',
  SecurityMiddleware.authenticate, // <-- ESSENCIAL
  (req, res, next) => new UserController(req, res, next).getCurrentUser(),
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

router.get(
  '/verify',
  SecurityMiddleware.authenticate, // <-- Usa o middleware de autenticação padrão
  (req, res) => {
    // Se chegou aqui, o token é válido e req.user existe.
    res.status(200).json({ valid: true, user: req.user });
  },
);

export default router;
