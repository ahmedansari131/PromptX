import { useDispatch } from "react-redux";
import { useGetUserQuery } from "../../services/api/authApi";
import { getUser } from "../../app/slices/auth/userSlice";
import { useEffect } from "react";

const useAuth = () => {
  const { data, error } = useGetUserQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(getUser({ isLoggedIn: data?.success }));
    } else if (error) {
      dispatch(getUser({ isLoggedIn: error?.success }));
    }
  }, [data, dispatch]);

  return { data, error };
};

export default useAuth;
