interface IInvoice {
  id?: number;
  amount: number;
  expiration: string;
  method: string;
  paid: boolean;
}

export default IInvoice;
