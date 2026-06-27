import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Input from "@/components/ui/Input";

export default function SearchInput() {
  const router = useRouter();
  const [value, setValue] = useState((router.query.search as string) || "");

  useEffect(() => {
    setValue((router.query.search as string) || "");
  }, [router.query.search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (value !== (router.query.search || "")) {
        const query = { ...router.query };
        if (value) {
          query.search = value;
        } else {
          delete query.search;
        }
        query.page = "1"; // Reset to first page when search changes
        router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [value, router]);

  return (
    <Input
      type="text"
      placeholder="Cari pengirim, bank, atau rekening..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}