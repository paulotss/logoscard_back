import axios from 'axios';
import * as crypto from 'crypto';
import {
    PagBankAmount,
    PagBankInterval,
    PagBankTrial,
    PagBankCustomer,
    PagBankCustomersResponse,
    PagBankSubscriptionCreationResponse,
} from "../interfaces/pagBank";
import InvoiceService from './invoice.service';

class PagBankService {
    private static getHeaders(contentType = "application/json") {
        return {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
            "Content-Type": contentType,
            Accept: "*/*",
        };
    }

    // ----- ORDERS -----
    public static async createOrder(customer: any, items: any[]) {
        const baseUrl = process.env.PAGBANK_API_ORDERS_URL;
        const url = `${baseUrl}/orders`;
        const headers = this.getHeaders();

        const payload = {
            customer: {
                name: customer.name,
                email: customer.email,
                tax_id: customer.tax_id,
                phones: customer.phones,
            },
            items: [
                {
                    name: "Assinatura logos card",
                    quantity: 1,
                    unit_amount: items[0].unit_amount,
                },
            ],
            qr_codes: [
                {
                    amount: {
                        value: items[0].unit_amount,
                    },
                },
            ],
        };

        try {
            const response = await axios.post(url, payload, { headers });
            return response.data;
        } catch (error) {
            console.error("Erro ao criar o pedido:", error);
            throw error;
        }
    }

    public static async getOrder(order_id: string) {
        const baseUrl = process.env.PAGBANK_API_ORDERS_URL;
        const url = `${baseUrl}/orders/${order_id}`;
        const headers = this.getHeaders();

        try {
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error) {
            console.error("Erro ao consultar o pedido:", error);
            throw error;
        }
    }

    // ----- PLANS -----
    public static async createPlan(amount: PagBankAmount, interval: PagBankInterval, trial: PagBankTrial, reference_id: string, name: string, description: string) {
        const baseUrl = process.env.PAGBANK_API_SUBSCRIPTIONS_URL;
        const url = `${baseUrl}/plans`;
        const headers = this.getHeaders();

        const payload = { amount, interval, trial, reference_id, name, description };

        try {
            const response = await axios.post(url, payload, { headers });
            return response.data;
        } catch (error) {
            console.error("Erro ao criar o plano:", error);
            throw error;
        }
    }

    public static async getPlans() {
        const baseUrl = process.env.PAGBANK_API_SUBSCRIPTIONS_URL;
        const url = `${baseUrl}/plans`;
        const headers = this.getHeaders();

        try {
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error) {
            console.error("Erro ao listar planos:", error);
            throw error;
        }
    }

    // ----- CUSTOMERS -----
    public static async createUser(data: any) {
        const baseUrl = process.env.PAGBANK_API_SUBSCRIPTIONS_URL;
        const url = `${baseUrl}/customers`;
        const headers = this.getHeaders();

        const payload = {
            name: data.name,
            email: data.email,
            tax_id: data.tax_id,
            phones: data.phones,
            birth_date: data.birth_date,
            billing_info: [
                {
                    card: {
                        holder: {
                            phone: data.phones[0],
                            name: data.name,
                            birth_date: data.birth_date,
                            tax_id: data.tax_id,
                        },
                        encrypted: data.billing_info,
                    },
                    type: "CREDIT_CARD",
                },
            ],
        };

        try {
            const response = await axios.post(url, payload, { headers });
            return response.data;
        } catch (error) {
            console.error("Erro ao criar o usuário:", error);
            throw error;
        }
    }

    public static async getCustomers(): Promise<PagBankCustomersResponse> {
        const baseUrl = process.env.PAGBANK_API_SUBSCRIPTIONS_URL;
        const url = `${baseUrl}/customers`;
        const headers = this.getHeaders();

        try {
            const response = await axios.get<PagBankCustomersResponse>(url, { headers });
            return response.data;
        } catch (error) {
            console.error("Erro ao listar clientes:", error);
            throw error;
        }
    }

    public static async findByCPF(cpf: string): Promise<{ id: string } | null> {
        try {
            const pagbankCustomerData = await this.getCustomers();
            const customers: PagBankCustomer[] = pagbankCustomerData.customers;
            const customer = customers.find((c: any) => c.tax_id === cpf);
            return customer ? { id: customer.id } : null;
        } catch (error) {
            console.error("Erro ao buscar cliente por CPF:", error);
            throw error;
        }
    }

    // ----- SIGNATURES -----
    public static async createSignature(data: any) {
        const baseUrl = process.env.PAGBANK_API_SUBSCRIPTIONS_URL;
        const url = `${baseUrl}/subscriptions`;
        const headers = this.getHeaders();

        const payload = {
            plan: data.plan,
            customer: data.customer,
            amount: data.amount,
            splits: data.splits,
            payment_method: [
                {
                    type: "CREDIT_CARD",
                    card: {
                        security_code: data.payment_method[0].card.security_code,
                    },
                },
            ],
            pro_rata: data.pro_rata,
            split_enabled: data.split_enabled,
            reference_id: data.reference_id,
        };

        try {
            const response = await axios.post<PagBankSubscriptionCreationResponse>(url, payload, { headers });
            return { pagbankSubscriptionId: response.data.id };
        } catch (error) {
            console.error("Erro ao criar a assinatura:", error);
            throw error;
        }
    }

    public static async getSubscriptions() {
        const baseUrl = process.env.PAGBANK_API_SUBSCRIPTIONS_URL;
        const url = `${baseUrl}/subscriptions`;
        const headers = this.getHeaders();

        try {
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error) {
            console.error("Erro ao listar assinaturas:", error);
            throw error;
        }
    }

    public static async cancelSubscription(subscriptionId: string) {
        const baseUrl = process.env.PAGBANK_API_SUBSCRIPTIONS_URL;
        const url = `${baseUrl}/subscriptions/${subscriptionId}/cancel`;
        const headers = this.getHeaders();

        try {
            await axios.put(url, null, { headers });
            return { success: true };
        } catch (error) {
            console.error("Erro ao cancelar assinatura:", error);
            throw error;
        }
    }

    // ----- INVOICES -----
    public static async getInvoices(subscriptionId: string, status = "PAID,UNPAID,WAITING,OVERDUE", offset = 0, limit = 100) {
        const baseUrl = process.env.PAGBANK_API_SUBSCRIPTIONS_URL;
        const url = `${baseUrl}/subscriptions/${subscriptionId}/invoices`;
        const headers = this.getHeaders();
        const params = { status, offset, limit };

        try {
            const response = await axios.get(url, { headers, params });
            return response.data;
        } catch (error) {
            console.error("Erro ao listar faturas:", error);
            throw error;
        }
    }

    // ----- WEBHOOK -----
    public static async handleWebhookEvent(notification: any, signature: string, rawBody: string) {
        if (!this.validateWebhookSignature(signature, rawBody)) {
            console.error("Webhook Error: Invalid Signature.");
            throw new Error("Invalid signature");
        }

        console.log('Webhook recebido:', notification.type);

        if (notification.type === 'charge.paid') {
            const subscriptionId = notification.data?.subscription?.id;
            if (subscriptionId) {
                await InvoiceService.payByPagBankSubscriptionId(subscriptionId);
            }
        }

        return { message: 'Webhook processado com sucesso' };
    }

    private static validateWebhookSignature(signatureFromHeader: string, rawBody: string): boolean {
        const secret = process.env.PAGBANK_WEBHOOK_SECRET;
        if (!secret) {
            console.error("PAGBANK_WEBHOOK_SECRET não configurado.");
            return false;
        }

        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(rawBody, 'utf8');
        const calculatedSignature = hmac.digest('hex');

        try {
            return crypto.timingSafeEqual(
                Buffer.from(signatureFromHeader, 'hex'),
                Buffer.from(calculatedSignature, 'hex')
            );
        } catch {
            return false;
        }
    }
}

export default PagBankService;
