import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.route';
import planRouter from './routes/plan.route';

const app = express();

app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(planRouter);

export default app;
