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
}

export default PagBankController;
