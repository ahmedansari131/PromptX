import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast } from "../../app/slices/toast/toastSlice";
import CloseIcon from '@mui/icons-material/Close';


const Toast = () => {
  const toasts = useSelector((state) => state.toasts);
  const dispatch = useDispatch();
  const [removing, setRemoving] = useState({});

  // Function to handle manual close
  const closeHandler = (id) => {
    setRemoving((prev) => ({ ...prev, [id]: true })); // Trigger slide-out animation
    setTimeout(() => dispatch(removeToast(id)), 500); // Delay removal to match animation
  };

  useEffect(() => {
    toasts.forEach((toast) => {
      setTimeout(() => {
        setRemoving((prev) => ({ ...prev, [toast.id]: true }));
        setTimeout(() => dispatch(removeToast(toast.id)), 500);
      }, toast.duration || 3000);
    });
  }, [toasts, dispatch]);

  return (
    <div className="fixed top-10 right-8 z-[10000] flex flex-col space-y-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`relative min-w-72 px-4 py-3 font-secondary font-light rounded-md shadow-dark text-white transition-transform bg-opacity-50 border border-light backdrop-blur-sm ${
            toast.type === "success"
              ? "bg-green-600 text-white border-green-500"
              : toast.type === "error"
              ? "bg-red-600 text-white border-red-700"
              : "bg-mintExtreme-300"
          } ${
            removing[toast.id] ? "animate-slideOutDown" : "animate-slideInTop"
          }`}
        >
          <span
            onClick={() => closeHandler(toast.id)}
            className="absolute top-2 right-2 text-mint cursor-pointer rounded-sm hover:bg-mintExtreme-300 px-1"
          >
            <CloseIcon
              style={{ fontSize: "1.1rem", transform: "translateY(-1px)" }}
            />
          </span>

          <div className="flex flex-col">
            <span className="font-bold text-[1rem] text-mint">
              {toast.heading}
            </span>
            <span className="text-[.9rem] text-mint">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
