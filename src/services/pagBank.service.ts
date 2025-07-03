import axios from 'axios';
import * as crypto from 'crypto';
import { parseStringPromise } from 'xml2js';
import { PagBankAmount, 
        PagBankInterval, 
        PagBankTrial, 
        PagBankCustomer, 
        PagBankCustomersResponse, 
        PagBankSubscriptionCreationResponse,
        PagBankLegacyTransaction
    } from "../interfaces/pagBank";
import InvoiceService from './invoice.service';

class PagBankService {

    constructor() {

    }

    public static async create(customer: any, items: any[]) {
        const url =
            `https://api.pagseguro.com/orders`;
        const headers = {
            Authorization:
                `Bearer ${process.env.PAGBANK_API_TOKEN}`,
                "Content-Type": "application/json",
            Accept: "*/*",
        };

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

    public static async get(order_id: string) {

        const url =
            `https://api.pagseguro.com/orders/${order_id}`;
        const headers = {
            Authorization:
                `Bearer ${process.env.PAGBANK_API_TOKEN}`,
                "Content-Type": "application/json",
            Accept: "*/*",
        };
      
        try {
          const response = await axios.get(url, { headers });
      
          return response.data;

        } catch (error) {
            console.error("Erro ao consultar o pedido:", error);
            throw error;
        }

    }

    public static async createPlan(
        amount: PagBankAmount,
        interval: PagBankInterval,
        trial: PagBankTrial,
        reference_id: string,
        name: string,
        description: string
    ) {
        const url =
            `https://api.assinaturas.pagseguro.com/plans`;
        const headers = {
            Authorization: 
                `Bearer ${process.env.PAGBANK_API_TOKEN}`,
                "Content-Type": "application/json",
            Accept: "*/*",
        };

        const payload = {
            amount,
            interval,
            trial,
            reference_id,
            name,
            description,
        };

        try {
            const response = await axios.post(url, payload, { headers });
            return response.data;
        } catch (error) {
            console.error("Erro ao criar o pedido:", error);
            throw error;
        }
    }

    public static async createUser(data: any) {
        const url =
            `https://api.assinaturas.pagseguro.com/customers`;
        const headers = {
            Authorization:
                `Bearer ${process.env.PAGBANK_API_TOKEN}`,
                "Content-Type": "application/json",
            Accept: "*/*",
        };

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

    public static async createSignature(data: any) {
        const url =
            `https://api.assinaturas.pagseguro.com/subscriptions`;
        const headers = {
            Authorization:
                `Bearer ${process.env.PAGBANK_API_TOKEN}`,
                "Content-Type": "application/json",
            Accept: "*/*",
        };

        const payload = {
            plan: data.plan,
            customer: data.customer,
            amount: data.amount,
            splits: data.splits,
            payment_method: [
                {
                    type: "CREDIT_CARD",
                    card: {
                        security_code:data.payment_method[0].card.security_code,
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
            console.error("Erro ao criar o usuário:", error);
            throw error;
        }

    }

    public static async handleWebhookEvent(notification: any, signature: string, rawBody: string) {
        // Cenário 1: É uma notificação legada com notificationCode?
        if (notification && notification.notificationCode) {
          console.log('Legacy webhook notification received. Code:', notification.notificationCode);
          return this._handleLegacyNotification(notification.notificationCode);
        }
        
        // Cenário 2: É uma notificação moderna em JSON?
        if (!this.validateWebhookSignature(signature, rawBody)) {
          console.error("Webhook Error: Invalid Signature.");
          throw new Error("Invalid signature");
        }
        
        console.log('Modern JSON webhook signature validated. Processing event:', notification.type);
        
        if (notification.type === 'charge.paid') {
          const subscriptionId = notification.data?.subscription?.id;
          if (subscriptionId) {
            await InvoiceService.payByPagBankSubscriptionId(subscriptionId);
          }
        }
        
        return { message: 'Webhook processed' };
      }
    
      // Lógica para o webhook legado (mantida para robustez)
      private static async _handleLegacyNotification(notificationCode: string) {
        const email = process.env.PAGBANK_EMAIL;
        const token = process.env.PAGBANK_LEGACY_TOKEN;
    
        if (!email || !token) {
          throw new Error("PagBank legacy credentials not configured.");
        }
    
        const url = 
            `https://ws.pagseguro.uol.com.br/v3/transactions/notifications/${notificationCode}?email=${email}&token=${token}`;
    
        try {
          const response = await axios.get(url, { headers: { 'Content-Type': 'application/xml; charset=ISO-8859-1' } });
          const parsedXml: PagBankLegacyTransaction = await parseStringPromise(response.data as string);
          const status = parsedXml.transaction.status[0];
          const referenceId = parsedXml.transaction.reference[0];
    
          if (status === '3' || status === '4') {
            if (referenceId) {
              // Aqui assumimos que o referenceId da transação é o mesmo da assinatura
              await InvoiceService.payByPagBankSubscriptionId(referenceId);
            }
          }
          return { message: 'Legacy webhook processed' };
        } catch (error) {
          console.error("Error fetching legacy notification details:", error);
          throw error;
        }
    }

    private static validateWebhookSignature
    (signatureFromHeader: string, rawBody: string): boolean {

        const secret = process.env.PAGBANK_WEBHOOK_SECRET;

        if (!secret) {
        console.error("FATAL: PAGBANK_WEBHOOK_SECRET is not configured.");
        return false;
        }

        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(rawBody, 'utf8');
        const calculatedSignature = hmac.digest('hex');

        try {
        return crypto.timingSafeEqual(Buffer.from(signatureFromHeader, 'hex'), 
        Buffer.from(calculatedSignature, 'hex'));
        } catch {
        return false;
        }
    }

    public static async getSubscriptions() {
        const url = `https://api.assinaturas.pagseguro.com/subscriptions`;
        const headers = {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
            Accept: "application/json",
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error) {
            console.error("Erro ao listar assinaturas:", error);
            throw error;
        }
    }

    public static async cancelSubscription(subscriptionId: string) {
        const url =
            `https://api.assinaturas.pagseguro.com/subscriptions/${subscriptionId}/cancel`;
        const headers = {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
            Accept: "application/json",
        };

        try {
            await axios.put(url, null, { headers });
            return { success: true };
        } catch (error) {
            console.error("Erro ao cancelar assinatura:", error);
            throw error;
        }
    }

    public static async getInvoices(
            subscriptionId: string, 
            status = "PAID,UNPAID,WAITING,OVERDUE", 
            offset = 0, 
            limit = 100
        ) {
        const url =
            `https://api.assinaturas.pagseguro.com/subscriptions/${subscriptionId}/invoices`;
        const headers = {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
            Accept: "application/json",
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error) {
            console.error("Erro ao listar faturas:", error);
            throw error;
        }
    }

    public static async getPlans() {
        const url = `https://api.assinaturas.pagseguro.com/plans`;
        const headers = {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
            Accept: "application/json",
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error) {
            console.error("Erro ao listar planos:", error);
            throw error;
        }
    }

    public static async getCustomers(): Promise<PagBankCustomersResponse> {
        const url =
            `https://api.assinaturas.pagseguro.com/customers`;
        const headers = {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
            Accept: "application/json",
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data as PagBankCustomersResponse;
        } catch (error) {
            console.error("Erro ao listar clientes:", error);
            throw error;
        }
    }

    public static async findByCPF(cpf: string): Promise<{ id: string } | null> {
        try {
            // Chamando o método interno em vez de uma URL da internet.
            const pagbankCustomerData = await this.getCustomers();
            const customers: PagBankCustomer[] = pagbankCustomerData.customers;
        
            if (!customers || !Array.isArray(customers)) {
                return null;
            }
        
            const customer = customers.find((c: any) => c.tax_id === cpf);
        
            return customer ? { id: customer.id } : null;

        } catch (error) {
            console.error("Erro ao buscar cliente por CPF:", error);
            throw error;
        }
    }
}

export default PagBankService;