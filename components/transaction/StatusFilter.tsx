import { useRouter } from "next/router";
import Select from "@/components/ui/Select";

export default function StatusFilter() {
  const router = useRouter();
  const status = (router.query.status as string) || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const query = { ...router.query };

    if (value) {
      query.status = value;
    } else {
      delete query.status;
    }
    query.page = "1"; // Reset to first page when filter changes

    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
  };

  return (
    <Select value={status} onChange={handleChange}>
      <option value="">Semua Status</option>
      <option value="PENDING">PENDING</option>
      <option value="APPROVED">APPROVED</option>
      <option value="REJECTED">REJECTED</option>
    </Select>
  );
}