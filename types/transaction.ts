export type TransactionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Transaction {
  id: string;
  sender_name: string;
  account_number: number;
  bank: string;
  amount: number;
  admin_fee: number;
  status: TransactionStatus;
  note: string;
  created_at: string;
}

export interface ListMeta {
  total: number;
  page: number;
  limit: number;
}

export interface TransactionQuery {
  page?: number;
  limit?: number;
  status?: TransactionStatus;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface CreateTransactionPayload {
  sender_name: string;
  account_number: number;
  bank: string;
  amount: number;
  admin_fee: number;
  status: TransactionStatus;
  note: string;
}

export interface UpdateStatusPayload {
  status: TransactionStatus;
}
