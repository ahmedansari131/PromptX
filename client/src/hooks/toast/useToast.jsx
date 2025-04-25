import { useDispatch } from "react-redux";
import { addToast } from "../../app/slices/toast/toastSlice";

const useToast = () => {
  const dispatch = useDispatch();

  const showToast = ({ message, heading, type = "info", duration = 3000 }) => {
    dispatch(
      addToast({
        heading,
        message,
        type,
        duration,
      })
    );
  };

  return { showToast };
};

export default useToast;
