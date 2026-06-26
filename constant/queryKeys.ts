import { TransactionQuery } from "@/types/transaction";

export const QUERY_KEYS = {
  TRANSACTIONS: (params: TransactionQuery) =>
    ["transactions", params] as const,

  TRANSACTION_DETAIL: (id: string) =>
    ["transaction", id] as const,
};