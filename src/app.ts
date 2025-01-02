import express from 'express';
import cors from 'cors';
import ErrorHandle from './middlewares/ErrorHandle';
import userRouter from './routes/user.route';
import planRouter from './routes/plan.route';
import invoiceRouter from './routes/invoice.route';
import assignmentRouter from './routes/assignment.route';
import benefitRouter from './routes/benefit.route';
import clientRouter from './routes/client.route';
import dependentRouter from './routes/dependent.route';
import depositRouter from './routes/deposit.route';
import withdrawRouter from './routes/withdraw.route';
import pagBankRouter from './routes/pagBank.route'

const app = express();

app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(planRouter);
app.use(invoiceRouter);
app.use(assignmentRouter);
app.use(benefitRouter);
app.use(clientRouter);
app.use(dependentRouter);
app.use(depositRouter);
app.use(withdrawRouter);
app.use(pagBankRouter);

app.use(ErrorHandle.handle);

export default app;
