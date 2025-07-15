import { Request, Response, NextFunction } from 'express';
import PagBankService from '../services/pagBank.service';

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
      return this.response.status(404).json({ message: 'Customer not found' });
    }

    if (!items) {
      return this.response.status(404).json({ message: 'Items not found' });
    }

    try {
      const result = await PagBankService.createOrder(customer, items);
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async get() {
    const { order_id } = this.request.params;

    if (!order_id) {
      return this.response.status(404).json({ message: 'Order not found' });
    }

    try {
      const result = await PagBankService.getOrder(order_id);
      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async createPlans() {
    try {
      const { amount, interval, trial, reference_id, name, description } =
        this.request.body;

      console.log(this.request.body);

      if (!amount || !interval || !name) {
        return this.response
          .status(400)
          .json({ error: 'Missing required fields' });
      }

      const createdPlan = await PagBankService.createPlan(
        amount,
        interval,
        trial,
        reference_id,
        name,
        description,
      );
      return this.response.status(201).json(createdPlan);
    } catch (error: any) {
      console.error(
        'Error creating plan:',
        error.response?.data || error.message,
      );
      return this.response.status(500).json({
        error: error.response?.data?.message || 'Internal Server Error',
      });
    }
  }

  public async createUser() {
    console.log(this.request.body);
    const { name, email, tax_id, phones, birth_date, billing_info } =
      this.request.body;

    console.log(this.request.body);

    if (
      !name ||
      !email ||
      !tax_id ||
      !phones ||
      !Array.isArray(billing_info) ||
      billing_info.length === 0
    ) {
      return this.response
        .status(400)
        .json({ message: 'Missing required fields' });
    }

    if (!billing_info[0]?.card?.encrypted) {
      return this.response
        .status(400)
        .json({ message: 'Encrypted card is required' });
    }

    try {
      const result = await PagBankService.createUser({
        name,
        email,
        tax_id,
        phones,
        birth_date,
        billing_info: billing_info[0].card.encrypted,
      });

      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async createSignature() {
    const {
      plan,
      customer,
      payment_method,
      pro_rata,
      split_enabled,
      reference_id,
    } = this.request.body;

    console.log(this.request.body);

    if (!plan || !reference_id || !customer || !payment_method) {
      return this.response
        .status(400)
        .json({ message: 'Missing required fields' });
    }

    try {
      const result = await PagBankService.createSignature({
        plan,
        customer,
        payment_method,
        pro_rata,
        split_enabled,
        reference_id,
      });

      this.response.status(200).json(result);
    } catch (error) {
      this.next(error);
    }
  }

  public async handleWebhook() {
    try {
      const signature = this.request.headers['x-pagseguro-signature'] as string;
      const { rawBody } = this.request as any;
      await PagBankService.handleWebhookEvent(
        this.request.body,
        signature,
        rawBody,
      );
      this.response.status(200).json({ message: 'Webhook received' });
    } catch (error) {
      this.next(error);
    }
  }

  public async getPublicKey() {
    try {
      const publicKey = process.env.PAGBANK_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error('PAGBANK_PUBLIC_KEY is not configured.');
      }
      this.response.status(200).json({ publicKey });
    } catch (error) {
      this.next(error);
    }
  }

  public async getSubscriptions() {
    try {
      const data = await PagBankService.getSubscriptions();
      return this.response.json(data);
    } catch (error) {
      console.error(error);
      return this.response
        .status(500)
        .json({ error: 'Erro ao listar assinaturas' });
    }
  }

  public async cancelSubscription() {
    const { subscriptionId } = this.request.params;

    if (!subscriptionId) {
      throw new Error('ID da assinatura inválido ou ausente');
    }

    try {
      await PagBankService.cancelSubscription(subscriptionId);
      return this.response.status(204).send();
    } catch (error) {
      console.error(error);
      return this.response
        .status(500)
        .json({ error: 'Erro ao cancelar assinatura' });
    }
  }

  public async getInvoices() {
    const { subscriptionId } = this.request.params;
    const { status, offset, limit } = this.request.query;

    if (!subscriptionId) {
      throw new Error('ID da assinatura inválido ou ausente');
    }

    try {
      const data = await PagBankService.getInvoices(
        subscriptionId,
        typeof status === 'string' ? status : 'PAID,UNPAID,WAITING,OVERDUE',
        offset ? Number(offset) : 0,
        limit ? Number(limit) : 100,
      );
      return this.response.json(data);
    } catch (error) {
      console.error(error);
      return this.response
        .status(500)
        .json({ error: 'Erro ao listar faturas' });
    }
  }

  public async getPlans() {
    try {
      const data = await PagBankService.getPlans();
      return this.response.json(data);
    } catch (error) {
      console.error(error);
      return this.response.status(500).json({ error: 'Erro ao listar planos' });
    }
  }

  public async getCustomers() {
    try {
      const data = await PagBankService.getCustomers();
      return this.response.json(data);
    } catch (error) {
      console.error(error);
      return this.response
        .status(500)
        .json({ error: 'Erro ao listar Clientes' });
    }
  }

  public async getByCpf() {
    try {
      const { cpf } = this.request.params;

      if (!cpf) {
        return this.response
          .status(400)
          .json({ message: 'Missing required fields' });
      }

      const customerId = await PagBankService.findByCPF(cpf);

      return this.response.status(200).json(customerId);
    } catch (error) {
      console.error(error);
      return this.response
        .status(500)
        .json({ error: 'Erro ao listar Clientes' });
    }
  }
}

export default PagBankController;
