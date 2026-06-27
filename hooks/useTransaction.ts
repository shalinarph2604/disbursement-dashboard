import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constant/queryKeys";
import { getTransactionById } from "@/services/transaction";

export function useTransaction(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSACTION_DETAIL(id ?? ""),
    queryFn: () => getTransactionById(id!),
    enabled: Boolean(id),
  });
}
