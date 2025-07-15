// Interfaces que você já tinha, agora com nomes padronizados

export interface PagBankAmount {
  currency: string;
  value: number;
}

export interface PagBankInterval {
  unit: 'MONTH' | 'YEAR' | 'WEEK' | 'DAY';
  length: number;
}

export interface PagBankTrial {
  enabled: boolean;
  hold_setup_fee: boolean;
  days: number;
}

export interface PagBankPhone {
  id?: number; // O ID é opcional, pois nem sempre está presente
  area: string;
  country: string;
  number: string;
}

export interface PagBankCardHolder {
  name: string;
  birth_date: string;
  tax_id: string;
  phone: PagBankPhone; // Corrigido para usar a interface Phone
}

export interface PagBankCard {
  token?: string; // Token pode não estar presente em todas as respostas
  brand: string;
  first_digits: string;
  last_digits: string;
  exp_month: string;
  exp_year: string;
  holder: PagBankCardHolder;
}

export interface PagBankBillingInfo {
  type: 'CREDIT_CARD' | string;
  card: PagBankCard;
}

export interface PagBankAddress {
  street: string;
  number: string;
  complement?: string; // Complemento é opcional
  locality: string;
  city: string;
  region_code: string;
  country: string;
  postal_code: string;
}

export interface PagBankLink {
  rel: string;
  href: string;
  media: string;
  type: string;
}

export interface PagBankCustomer {
  id: string;
  email: string;
  name: string;
  tax_id: string;
  phones: PagBankPhone[];
  birth_date: string;
  billing_info?: PagBankBillingInfo[]; // Pode não vir em todos os contextos
  address?: PagBankAddress; // Endereço pode ser opcional
  created_at: string;
  updated_at: string;
  links?: PagBankLink[];
}

export interface PagBankCustomersResponse {
  customers: PagBankCustomer[];
  result_set: {
    total: number;
    offset: number;
    limit: number;
  };
}


// --- NOVAS INTERFACES (Para descrever o objeto de Assinatura completo) ---

// Define os tipos de status possíveis para uma assinatura
export type PagBankSubscriptionStatus = 'ACTIVE' | 'SUSPENDED' | 'CANCELED' | 'EXPIRED' | 'PENDING';

// Descreve o objeto do plano associado à assinatura
export interface PagBankPlan {
  id: string;
  name: string;
  interval: PagBankInterval;
}

// Descreve o ciclo de cobrança atual
export interface PagBankBillingCycle {
  occurrence: number;
  total: number;
}

// A INTERFACE PRINCIPAL E COMPLETA DA ASSINATURA
export interface PagBankSubscription {
  id: string;
  reference_id: string;
  amount: PagBankAmount;
  status: PagBankSubscriptionStatus;
  plan: PagBankPlan;
  payment_method: PagBankBillingInfo[];
  billing_cycle: PagBankBillingCycle;
  pro_rata: boolean;
  customer: PagBankCustomer;
  created_at: string;
  updated_at: string;
  exp_at: string;
  split_enabled: boolean;
  links: PagBankLink[];
}

// Interface para a resposta da API ao criar uma assinatura
export interface PagBankSubscriptionCreationResponse {
    id: string;
    status: string;
}



