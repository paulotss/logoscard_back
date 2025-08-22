import { Router } from "express";
import DashboardController from "../controllers/dashboard.controller";
import SecurityMiddleware from "../middlewares/SecurityMiddleware";

const router = Router();

const dashboardController = new DashboardController();

router.get(
  '/summary',
  SecurityMiddleware.authenticate,
  (req, res, next) => dashboardController.getSummary(req, res, next),
);

export default router;


