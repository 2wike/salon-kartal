import { useState, useCallback } from "react";
import { createElement } from "react";

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const Toast = toast
    ? createElement(
        "div",
        { className: `toast toast-${toast.type}` },
        toast.message,
      )
    : null;

  return { showToast, Toast };
};
