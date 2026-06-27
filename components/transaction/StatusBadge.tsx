import Badge from "@/components/ui/Badge";
import type { TransactionStatus } from "@/types/transaction";

interface StatusBadgeProps {
  status: TransactionStatus;
}

const statusVariant: Record<TransactionStatus, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}
