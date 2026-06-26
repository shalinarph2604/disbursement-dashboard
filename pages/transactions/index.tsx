import ProtectedRoute from "../ProtectedRoute"
import StatusFilter from "@/components/transaction/StatusFilter"
import SearchInput from "@/components/transaction/SearchInput"
import TransactionTable from "@/components/transaction/TransactionTable"
import Pagination from "@/components/ui/Pagination"

export default function Transactions () {
    return (
        <ProtectedRoute>
            <SearchInput />
            <StatusFilter />
            <TransactionTable />
            <Pagination />
        </ProtectedRoute>
    )
}