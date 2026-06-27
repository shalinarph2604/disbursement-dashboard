import axiosInstance from "../lib/axios";
import {
  CreateTransactionPayload,
  Transaction,
  TransactionQuery,
  TransactionStatus,
  UpdateStatusPayload,
} from "../types/transaction";

const mapStatus = (status: string): TransactionStatus => {
  const normalized = String(status).toUpperCase();
  if (normalized === "SUCCESS" || normalized === "APPROVED") return "APPROVED";
  if (normalized === "FAILED" || normalized === "REJECTED") return "REJECTED";
  return "PENDING";
};

const mapTransaction = (item: any): Transaction => ({
  id: String(item.id),
  sender_name: String(item.sender_name || ""),
  account_number: Number(item.account_number) || 0,
  bank: String(item.bank || ""),
  amount: Number(item.amount) || 0,
  admin_fee: Number(item.admin_fee) || 0,
  status: mapStatus(item.status),
  note: String(item.note || ""),
  created_at: String(item.created_at || ""),
});

const parseDate = (d: string) => {
  const time = new Date(d).getTime();
  return isNaN(time) ? 0 : time;
};

export const getTransactions = async (params: TransactionQuery) => {
  const response = await axiosInstance.get<any[]>("/transactions");
  let list = (response.data || []).map(mapTransaction);

  // 1. Filter by status
  if (params.status) {
    list = list.filter((item) => item.status === params.status);
  }

  // 2. Search
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    list = list.filter(
      (item) =>
        item.sender_name.toLowerCase().includes(searchLower) ||
        String(item.account_number).includes(searchLower) ||
        item.bank.toLowerCase().includes(searchLower) ||
        item.note.toLowerCase().includes(searchLower)
    );
  }

  // 3. Sort
  if (params.sortBy) {
    const sortBy = params.sortBy as keyof Transaction;
    const order = params.order || "asc";
    list = [...list].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "created_at") {
        const timeA = parseDate(a.created_at);
        const timeB = parseDate(b.created_at);
        return order === "asc" ? timeA - timeB : timeB - timeA;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return order === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  } else {
    // Default sort: newest first
    list = [...list].sort((a, b) => parseDate(b.created_at) - parseDate(a.created_at));
  }

  // 4. Pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const total = list.length;
  const startIndex = (page - 1) * limit;
  const paginatedData = list.slice(startIndex, startIndex + limit);

  return {
    data: paginatedData,
    meta: {
      total,
      page,
      limit,
    },
  };
};

export const getTransactionById = async (id: string) => {
  const response = await axiosInstance.get(`/transactions/${id}`);
  return {
    data: mapTransaction(response.data),
  };
};

export const createTransaction = async (payload: CreateTransactionPayload) => {
  const response = await axiosInstance.post("/transactions", payload);
  return {
    data: mapTransaction(response.data),
  };
};

export const updateStatus = async (id: string, payload: UpdateStatusPayload) => {
  const response = await axiosInstance.put(`/transactions/${id}`, payload);
  return {
    data: mapTransaction(response.data),
  };
};
