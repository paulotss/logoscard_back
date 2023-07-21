import express from 'express';
import cors from 'cors';
import ErrorHandle from './middlewares/ErrorHandle';
import userRouter from './routes/user.route';
import planRouter from './routes/plan.route';
import invoiceRouter from './routes/invoice.route';
import assignmentRouter from './routes/assignment.route';
import benefitRouter from './routes/benefit.route';
import adminRouter from './routes/admin.route';
import clientRouter from './routes/client.route';

const app = express();

app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(planRouter);
app.use(invoiceRouter);
app.use(assignmentRouter);
app.use(benefitRouter);
app.use(adminRouter);
app.use(clientRouter);

app.use(ErrorHandle.handle);

export default app;
