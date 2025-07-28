import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import ErrorHandle from './middlewares/ErrorHandle';
// Importa apenas os middlewares de rota e o de segurança que criamos
import SecurityMiddleware from './middlewares/SecurityMiddleware';
import userRouter from './routes/user.route';
import planRouter from './routes/plan.route';
import invoiceRouter from './routes/invoice.route';
import assignmentRouter from './routes/assignment.route';
import benefitRouter from './routes/benefit.route';
import clientRouter from './routes/client.route';
import dependentRouter from './routes/dependent.route';
import depositRouter from './routes/deposit.route';
import withdrawRouter from './routes/withdraw.route';
import pagBankRouter from './routes/pagBank.route';
import cardRouter from './routes/card.route';

const app = express();

// --- CONFIGURAÇÃO DE MIDDLEWARES ---

// 1. Confiança no Proxy (importante para rate limiting e logs se estiver atrás de um)
app.set('trust proxy', 1);

// 2. CORS (Cross-Origin Resource Sharing) - DEVE VIR NO INÍCIO
// Permite que seu frontend (ex: localhost:3000) se comunique com o backend (localhost:3001)
app.use(cors());

// 3. Middlewares de Segurança e Otimização
app.use(helmet()); // Adiciona vários headers de segurança
app.use(compression()); // Comprime as respostas para melhor performance

// 4. Logging
// O 'dev' é ótimo para desenvolvimento. Em produção, você pode usar 'combined'.
app.use(morgan('dev')); 

// 5. Body Parsers (para ler o corpo das requisições)
// O raw parser para o webhook deve ser aplicado na rota específica, como já corrigimos.
app.use(express.json({ limit: '1mb' })); // Para requisições JSON
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 6. Rate Limiting (Proteção contra ataques de força bruta)
app.use('/api/', SecurityMiddleware.apiRateLimit); // Limite geral para a API

// --- ROTAS DA APLICAÇÃO ---
app.use('/api/users', userRouter);
app.use('/api/plans', planRouter);
app.use('/api/invoices', invoiceRouter);
app.use('/api/assignments', assignmentRouter);
app.use('/api/benefits', benefitRouter);
app.use('/api/clients', clientRouter);
app.use('/api/dependents', dependentRouter);
app.use('/api/deposits', depositRouter);
app.use('/api/withdraws', withdrawRouter);
app.use('/api/pagbank', pagBankRouter);
app.use('/api/card', cardRouter);

// --- ROTA DE HEALTH CHECK ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// --- MIDDLEWARE DE ERRO (SEMPRE POR ÚLTIMO) ---
app.use(ErrorHandle.handle);

export default app;

