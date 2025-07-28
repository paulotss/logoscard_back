import { Router } from 'express';
import CardTokenController from '../controllers/card.token.controller';
// ALTERADO: Removemos o import do AuthHandle que foi excluído.
import SecurityMiddleware from '../middlewares/SecurityMiddleware';

const cardRoutes = Router();

// Aplica o rate limit a todas as rotas de cartão, como já estava.
cardRoutes.use(SecurityMiddleware.paymentRateLimit);

// POST /card/generate-token - Gerar um novo token de cartão
cardRoutes.post(
  '/generate-token',
  SecurityMiddleware.authenticate, // ALTERADO: Usa o middleware padrão
  (req, res, next) => {
    const controller = new CardTokenController(req, res, next);
    controller.generateToken();
  }
);

// POST /card/validate-token - Validar um token de cartão (geralmente pública)
cardRoutes.post('/validate-token', (req, res, next) => {
  const controller = new CardTokenController(req, res, next);
  controller.validateToken();
});

// POST /card/use-token - Marcar um token como usado
cardRoutes.post('/use-token', (req, res, next) => {
  const controller = new CardTokenController(req, res, next);
  controller.useToken();
});

// GET /card/tokens - Obter os tokens ativos de um usuário (autenticado)
cardRoutes.get(
  '/tokens',
  SecurityMiddleware.authenticate, // ALTERADO: Usa o middleware padrão
  (req, res, next) => {
    const controller = new CardTokenController(req, res, next);
    controller.getUserTokens();
  }
);

// --- Rotas de Admin ---
// Apenas administradores podem acessar as rotas abaixo

// GET /card/admin/token/:token - Obter informações de um token
cardRoutes.get(
  '/admin/token/:token',
  SecurityMiddleware.authenticate,      // ALTERADO: 1º - Verifica se está logado
  SecurityMiddleware.requireAdmin,      // ADICIONADO: 2º - Verifica se é admin
  (req, res, next) => {
    const controller = new CardTokenController(req, res, next);
    controller.getTokenInfo();
  }
);

// POST /card/admin/cleanup - Limpar tokens expirados
cardRoutes.post(
  '/admin/cleanup',
  SecurityMiddleware.authenticate,      // ALTERADO: 1º - Verifica se está logado
  SecurityMiddleware.requireAdmin,      // ADICIONADO: 2º - Verifica se é admin
  (req, res, next) => {
    const controller = new CardTokenController(req, res, next);
    controller.cleanupExpiredTokens();
  }
);


export default cardRoutes;