import { ReactNode } from "react";
import { ToastContainer, toast } from "react-toastify";

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error") => void;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export function useToast(): ToastContextType {
  const showToast = (message: string, type: "success" | "error" = "success") => {
    if (type === "success") {
      toast.success(message);
      return;
    }

    toast.error(message);
  };

  return { showToast };
}
