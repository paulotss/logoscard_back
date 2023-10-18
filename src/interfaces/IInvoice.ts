interface IInvoice {
  id?: number;
  amount: number;
  expiration: string;
  method: string;
  paid: boolean;
  userId?: number;
}

export default IInvoice;
