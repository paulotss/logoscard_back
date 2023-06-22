import express from 'express';
import cors from 'cors';
import ErrorHandle from './middlewares/ErrorHandle';
import userRouter from './routes/user.route';
import planRouter from './routes/plan.route';
import invoiceRouter from './routes/invoice.route';

const app = express();

app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(planRouter);
app.use(invoiceRouter);

app.use(ErrorHandle.handle);

export default app;
