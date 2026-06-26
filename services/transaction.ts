import axiosInstance from "../lib/axios";
import {
  CreateTransactionPayload,
  TransactionQuery,
  UpdateStatusPayload,
} from "../types/transaction";

export const getTransactions = (params: TransactionQuery) =>
  axiosInstance.get("/transactions", { params });

export const getTransactionById = (id: string) =>
  axiosInstance.get(`/transactions/${id}`);

export const createTransaction = (
  payload: CreateTransactionPayload
) => axiosInstance.post("/transactions", payload);

export const updateStatus = (
  id: string,
  payload: UpdateStatusPayload
) => axiosInstance.put(`/transactions/${id}`, payload);