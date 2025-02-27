import { Request, Response, NextFunction } from 'express';
import PagBankService from '../services/pagBank.service';
import { error } from 'console';

class PagBankController {

    private request: Request;
    private response: Response;
    private next: NextFunction;

    constructor(req: Request, res: Response, next: NextFunction) {
        this.request = req;
        this.response = res;
        this.next = next;
    }

    public async create() {
        const { customer, items } = this.request.body;

        if (!customer) {
            return this.response.status(404).json({ message: "Customer not found" });
          }

        if (!items) {
            return this.response.status(404).json({ message: "Items not found" });
        }

        try {
            const result = await PagBankService.create(customer, items);
            this.response.status(200).json(result);
        } catch (error) {
            this.next(error);
        }
    }

    public async get() {
        const { order_id } = this.request.params;

        if (!order_id) {
            return this.response.status(404).json({message: "Order not found"});
        }

        try {
            const result = await PagBankService.get(order_id);
            this.response.status(200).json(result);
        } catch (error) {
            this.next(error);
        }
    }

    public async createPlans() {
        try {
            const { amount, interval, trial, reference_id, name, description } = this.request.body;

            if (!amount || !interval || !name) {
                return this.response.status(400).json({ error: "Missing required fields" });
              }

            const createdPlan = await PagBankService.createPlan(amount, interval, trial, reference_id, name, description);
            return this.response.status(201).json(createdPlan);


        } catch (error: any) {
            console.error("Error creating plan:", error.response?.data || error.message);
        return this.response.status(500).json({
            error: error.response?.data?.message || "Internal Server Error"
        });
        }

    }
}

export default PagBankController;
