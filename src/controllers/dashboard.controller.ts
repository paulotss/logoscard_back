import { Request, Response, NextFunction } from "express";
import DashboardService from "../services/dashboard.service";

class DashboardController {

      public async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summaryData = await DashboardService.getSummary();
      res.status(200).json(summaryData);
    } catch (error) {
      next(error);
    }
  }

}

export default DashboardController;