import { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children?: ReactNode;
  className?: string;
  colSpan?: number;
}

export default function Table({ children, className = "" }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full text-left text-sm ${className}`}>{children}</table>
    </div>
  );
}

export function TableHeader({ children }: { children: ReactNode }) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableHeadRow({ children, className = "" }: TableRowProps) {
  return (
    <tr className={`border-b border-slate-200 text-slate-600 ${className}`}>{children}</tr>
  );
}

export function TableRow({ children, className = "" }: TableRowProps) {
  return (
    <tr className={`border-b border-slate-100 hover:bg-slate-50 ${className}`}>{children}</tr>
  );
}

export function TableHead({ children, className = "" }: TableCellProps) {
  return <th className={`px-3 py-3 font-semibold ${className}`}>{children}</th>;
}

export function TableCell({ children, className = "", colSpan }: TableCellProps) {
  return (
    <td className={`px-3 py-3 ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
}
