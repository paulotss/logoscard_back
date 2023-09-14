interface IInvoice {
  id: number;
  amount: number;
  expiration: string;
  paid: boolean;
}

export default IInvoice;
