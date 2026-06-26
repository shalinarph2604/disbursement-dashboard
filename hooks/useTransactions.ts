import { useQuery } from "@tanstack/react-query";

import { getTransactions } from "@/services/transaction";
import { QUERY_KEYS } from "@/constant/queryKeys";
import { TransactionQuery } from "@/types/transaction";

export function useTransactions(params: TransactionQuery) {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS(params),
    queryFn: () => getTransactions(params),
  });
}