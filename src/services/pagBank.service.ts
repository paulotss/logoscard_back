import axios from 'axios';

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
}

export default PagBankService;
