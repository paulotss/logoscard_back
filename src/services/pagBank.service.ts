import axios from 'axios';
import { Amount, Interval, Trial } from "../interfaces/pagBank";

class PagBankService {

    constructor() {

    }

    public static async create(customer: any, items: any[]) {
        const url = `https://api.pagseguro.com/orders`;
        const headers = {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
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

        const url = `https://api.pagseguro.com/orders/${order_id}`;
        const headers = {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
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
        amount: Amount,
        interval: Interval,
        trial: Trial,
        reference_id: string,
        name: string,
        description: string
    ) {
        const url = `https://api.assinaturas.pagseguro.com/plans`;
        const headers = {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
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
        const url = `https://api.assinaturas.pagseguro.com/customers`;
        const headers = {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
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
        const url = `https://api.assinaturas.pagseguro.com/subscriptions`;
        const headers = {
            Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
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
                        security_code: data.payment_method[0].card.security_code,
                    },
                },
            ],
            pro_rata: data.pro_rata,
            split_enabled: data.split_enabled,
            reference_id: data.reference_id,
        };
        

        try {
            const response = await axios.post(url, payload, { headers });
            return response.data;
        } catch (error) {
            console.error("Erro ao criar o usuário:", error);
            throw error;
        }

    }

    // NÃO TESTADAS
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
        const url = `https://api.assinaturas.pagseguro.com/subscriptions/${subscriptionId}/cancel`;
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

    public static async getInvoices(subscriptionId: string, status = "PAID,UNPAID,WAITING,OVERDUE", offset = 0, limit = 100) {
        const url = `https://api.assinaturas.pagseguro.com/subscriptions/${subscriptionId}/invoices`;
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

}

export default PagBankService;
