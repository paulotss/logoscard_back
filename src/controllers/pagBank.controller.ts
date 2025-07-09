import { Request, Response, NextFunction } from 'express';
import PagBankService from '../services/pagBank.service';
import rateLimit from 'express-rate-limit';
import { body, param, validationResult } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';
import CustomError from '../utils/CustomError';

class PagBankController {
  private request: Request;
  private response: Response;
  private next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }

  // Input validation middleware
  private validateInput() {
    const errors = validationResult(this.request);
    if (!errors.isEmpty()) {
      throw new CustomError('Invalid input data', 400);
    }
  }

  // Sanitize input data
  private sanitizeInput(data: any): any {
    if (typeof data === 'string') {
      return DOMPurify.sanitize(data.trim());
    }
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const key in data) {
        sanitized[key] = this.sanitizeInput(data[key]);
      }
      return sanitized;
    }
    return data;
  }

  // Log security events (without sensitive data)
  private logSecurityEvent(event: string, details: any = {}) {
    const sanitizedDetails = { ...details };
    // Remove sensitive fields
    delete sanitizedDetails.card;
    delete sanitizedDetails.encrypted;
    delete sanitizedDetails.tax_id;
    delete sanitizedDetails.billing_info;

    console.log(`[SECURITY] ${event}`, {
      timestamp: new Date().toISOString(),
      ip: this.request.ip,
      userAgent: this.request.get('User-Agent'),
      ...sanitizedDetails,
    });
  }

  public async create() {
    try {
      this.validateInput();

      const { customer, items } = this.sanitizeInput(this.request.body);

      if (!customer) {
        this.logSecurityEvent('CREATE_ORDER_MISSING_CUSTOMER');
        return this.response
          .status(400)
          .json({ message: 'Customer data is required' });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        this.logSecurityEvent('CREATE_ORDER_MISSING_ITEMS');
        return this.response
          .status(400)
          .json({ message: 'Items are required' });
      }

      this.logSecurityEvent('CREATE_ORDER_ATTEMPT');

      const result = await PagBankService.create(customer, items);

      this.logSecurityEvent('CREATE_ORDER_SUCCESS', { orderId: result.id });
      this.response.status(200).json(result);
    } catch (error) {
      this.logSecurityEvent('CREATE_ORDER_ERROR', { error: error.message });
      this.next(error);
    }
  }

  public async get() {
    try {
      this.validateInput();

      const { order_id } = this.sanitizeInput(this.request.params);

      if (!order_id || typeof order_id !== 'string') {
        this.logSecurityEvent('GET_ORDER_INVALID_ID');
        return this.response
          .status(400)
          .json({ message: 'Valid order ID is required' });
      }

      this.logSecurityEvent('GET_ORDER_ATTEMPT', { orderId: order_id });

      const result = await PagBankService.get(order_id);
      this.response.status(200).json(result);
    } catch (error) {
      this.logSecurityEvent('GET_ORDER_ERROR', { error: error.message });
      this.next(error);
    }
  }

  public async createPlans() {
    try {
      this.validateInput();

      const { amount, interval, trial, reference_id, name, description } =
        this.sanitizeInput(this.request.body);

      if (!amount || !interval || !name) {
        this.logSecurityEvent('CREATE_PLAN_MISSING_FIELDS');
        return this.response
          .status(400)
          .json({ error: 'Missing required fields: amount, interval, name' });
      }

      // Validate amount is positive number
      if (typeof amount !== 'number' || amount <= 0) {
        this.logSecurityEvent('CREATE_PLAN_INVALID_AMOUNT');
        return this.response
          .status(400)
          .json({ error: 'Amount must be a positive number' });
      }

      this.logSecurityEvent('CREATE_PLAN_ATTEMPT');

      const createdPlan = await PagBankService.createPlan(
        amount,
        interval,
        trial,
        reference_id,
        name,
        description,
      );

      this.logSecurityEvent('CREATE_PLAN_SUCCESS', { planId: createdPlan.id });
      return this.response.status(201).json(createdPlan);
    } catch (error: any) {
      this.logSecurityEvent('CREATE_PLAN_ERROR', { error: error.message });
      // Don't expose internal error details
      return this.response.status(500).json({
        error: 'Failed to create plan',
      });
    }
  }

  public async createUser() {
    try {
      this.validateInput();

      const { name, email, tax_id, phones, birth_date, billing_info } =
        this.sanitizeInput(this.request.body);

      if (
        !name ||
        !email ||
        !tax_id ||
        !phones ||
        !Array.isArray(billing_info) ||
        billing_info.length === 0
      ) {
        this.logSecurityEvent('CREATE_USER_MISSING_FIELDS');
        return this.response
          .status(400)
          .json({ message: 'Missing required fields' });
      }

      if (!billing_info[0]?.card?.encrypted) {
        this.logSecurityEvent('CREATE_USER_MISSING_ENCRYPTED_CARD');
        return this.response
          .status(400)
          .json({ message: 'Encrypted card is required' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.logSecurityEvent('CREATE_USER_INVALID_EMAIL');
        return this.response
          .status(400)
          .json({ message: 'Invalid email format' });
      }

      this.logSecurityEvent('CREATE_USER_ATTEMPT');

      const result = await PagBankService.createUser({
        name,
        email,
        tax_id,
        phones,
        birth_date,
        billing_info: billing_info[0].card.encrypted,
      });

      this.logSecurityEvent('CREATE_USER_SUCCESS', { userId: result.id });
      this.response.status(200).json(result);
    } catch (error) {
      this.logSecurityEvent('CREATE_USER_ERROR', { error: error.message });
      this.next(error);
    }
  }

  public async createSignature() {
    try {
      this.validateInput();

      const {
        plan,
        customer,
        payment_method,
        pro_rata,
        split_enabled,
        reference_id,
      } = this.sanitizeInput(this.request.body);

      if (!plan || !reference_id || !customer || !payment_method) {
        this.logSecurityEvent('CREATE_SIGNATURE_MISSING_FIELDS');
        return this.response.status(400).json({
          message:
            'Missing required fields: plan, customer, payment_method, reference_id',
        });
      }

      this.logSecurityEvent('CREATE_SIGNATURE_ATTEMPT');

      const result = await PagBankService.createSignature({
        plan,
        customer,
        payment_method,
        pro_rata,
        split_enabled,
        reference_id,
      });

      this.logSecurityEvent('CREATE_SIGNATURE_SUCCESS', {
        signatureId: result.id,
      });
      this.response.status(200).json(result);
    } catch (error) {
      this.logSecurityEvent('CREATE_SIGNATURE_ERROR', { error: error.message });
      this.next(error);
    }
  }

  public async getSubscriptions() {
    try {
      this.logSecurityEvent('GET_SUBSCRIPTIONS_ATTEMPT');

      const data = await PagBankService.getSubscriptions();
      return this.response.json(data);
    } catch (error) {
      this.logSecurityEvent('GET_SUBSCRIPTIONS_ERROR', {
        error: error.message,
      });
      return this.response
        .status(500)
        .json({ error: 'Failed to retrieve subscriptions' });
    }
  }

  public async cancelSubscription() {
    try {
      this.validateInput();

      const { subscriptionId } = this.sanitizeInput(this.request.params);

      if (!subscriptionId || typeof subscriptionId !== 'string') {
        this.logSecurityEvent('CANCEL_SUBSCRIPTION_INVALID_ID');
        return this.response
          .status(400)
          .json({ error: 'Valid subscription ID is required' });
      }

      this.logSecurityEvent('CANCEL_SUBSCRIPTION_ATTEMPT', { subscriptionId });

      await PagBankService.cancelSubscription(subscriptionId);

      this.logSecurityEvent('CANCEL_SUBSCRIPTION_SUCCESS', { subscriptionId });
      return this.response.status(204).send();
    } catch (error) {
      this.logSecurityEvent('CANCEL_SUBSCRIPTION_ERROR', {
        error: error.message,
      });
      return this.response
        .status(500)
        .json({ error: 'Failed to cancel subscription' });
    }
  }

  public async getInvoices() {
    try {
      this.validateInput();

      const { subscriptionId } = this.sanitizeInput(this.request.params);
      const { status, offset, limit } = this.sanitizeInput(this.request.query);

      if (!subscriptionId || typeof subscriptionId !== 'string') {
        this.logSecurityEvent('GET_INVOICES_INVALID_ID');
        return this.response
          .status(400)
          .json({ error: 'Valid subscription ID is required' });
      }

      this.logSecurityEvent('GET_INVOICES_ATTEMPT', { subscriptionId });

      const data = await PagBankService.getInvoices(
        subscriptionId,
        typeof status === 'string' ? status : 'PAID,UNPAID,WAITING,OVERDUE',
        offset ? Number(offset) : 0,
        limit ? Number(limit) : 100,
      );
      return this.response.json(data);
    } catch (error) {
      this.logSecurityEvent('GET_INVOICES_ERROR', { error: error.message });
      return this.response
        .status(500)
        .json({ error: 'Failed to retrieve invoices' });
    }
  }

  public async getPlans() {
    try {
      this.logSecurityEvent('GET_PLANS_ATTEMPT');

      const data = await PagBankService.getPlans();
      return this.response.json(data);
    } catch (error) {
      this.logSecurityEvent('GET_PLANS_ERROR', { error: error.message });
      return this.response
        .status(500)
        .json({ error: 'Failed to retrieve plans' });
    }
  }

  public async getCustomers() {
    try {
      this.logSecurityEvent('GET_CUSTOMERS_ATTEMPT');

      const data = await PagBankService.getCustomers();
      return this.response.json(data);
    } catch (error) {
      this.logSecurityEvent('GET_CUSTOMERS_ERROR', { error: error.message });
      return this.response
        .status(500)
        .json({ error: 'Failed to retrieve customers' });
    }
  }

  public async getByCpf() {
    try {
      this.validateInput();

      const { cpf } = this.sanitizeInput(this.request.params);

      if (!cpf || typeof cpf !== 'string') {
        this.logSecurityEvent('GET_BY_CPF_INVALID_CPF');
        return this.response
          .status(400)
          .json({ message: 'Valid CPF is required' });
      }

      // Validate CPF format (basic)
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
      if (!cpfRegex.test(cpf)) {
        this.logSecurityEvent('GET_BY_CPF_INVALID_FORMAT');
        return this.response
          .status(400)
          .json({ message: 'Invalid CPF format' });
      }

      this.logSecurityEvent('GET_BY_CPF_ATTEMPT');

      const customerId = await PagBankService.findByCPF(cpf);

      return this.response.status(200).json(customerId);
    } catch (error) {
      this.logSecurityEvent('GET_BY_CPF_ERROR', { error: error.message });
      return this.response
        .status(500)
        .json({ error: 'Failed to find customer' });
    }
  }
}

export default PagBankController;
