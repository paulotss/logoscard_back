interface Amount {
    currency: string;
    value: number;
}

interface Interval {
    unit: string;
    length: number;
}

interface Trial {
    enabled: boolean;
    hold_setup_fee: boolean;
    days: number;
}

interface Phone {
    id: number;
    area: string;
    country: string;
    number: string;
  }
  
  interface CardHolder {
    name: string;
    birth_date: string;
    tax_id: string;
    phone: {
      area: string;
      country: string;
      number: string;
    };
  }
  
  interface Card {
    token: string;
    brand: string;
    first_digits: string;
    last_digits: string;
    exp_month: string;
    exp_year: string;
    holder: CardHolder;
  }
  
  interface BillingInfo {
    type: string;
    card: Card;
  }
  
  interface Customer {
    id: string;
    email: string;
    name: string;
    tax_id: string;
    phones: Phone[];
    birth_date: string;
    billing_info: BillingInfo[];
    created_at: string;
    updated_at: string;
    links: {
      rel: string;
      href: string;
      media: string;
      type: string;
    }[];
  }

  interface CustomersResponse {
    result_set: {
      total: number;
      offset: number;
      limit: number;
    };
    customers: Customer[];
  }

export { Amount, Interval, Trial, Customer, CustomersResponse };
