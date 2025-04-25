import React, { useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, Dialogue, DropdownMenu, Logo } from "../";
import GoogleIcon from "@mui/icons-material/Google";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGoogleSignInMutation,
  useSignedOutUserMutation,
} from "../../services/api/authApi";
import useToast from "../../hooks/toast/useToast";
import { getUser } from "../../app/slices/auth/userSlice";
import useAuth from "../../hooks/auth/useAuth";
import useDialog from "../../hooks/dialog/useDialog";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [googleSignIn, { isLoading }] = useGoogleSignInMutation();
  const { showToast } = useToast();
  const { data, error } = useAuth();
  const user = useSelector((state) => state.user.user);
  const { isDialogOpen, openDialogHandler, closeDialogHandler } = useDialog();
  const [signoutUser, { isLoading: signoutLoader }] =
    useSignedOutUserMutation();

  const dropdownContent = [
    {
      name: "Sign out",
      isLink: false,
      action: openDialogHandler,
    },
  ];

  const signoutHandler = async () => {
    try {
      const response = await signoutUser();
      if (response.data) {
        closeDialogHandler();
        navigate("/");
      }

      if (response.error) {
        alert(response.error.data?.message);
        return;
      }
    } catch (error) {
      console.log("Error occurred while signing out the user ", error);
    }
  };

  useEffect(() => {
    dispatch(getUser({ user: data }));
  }, [data, error]);

  const googleOAuthHandler = useGoogleLogin({
    flow: "auth-code",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "openid",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/calendar",
    ].join(" "),
    onSuccess: async (tokenResponse) => {
      const { code } = tokenResponse;

      try {
        // Send the code to your backend for token exchange
        const data = {
          code: code,
          redirect_uri: "http://localhost:5173",
        };
        const response = await googleSignIn(data);
        const successResponse = response?.data;
        const errorResponse = response?.error;

        if (errorResponse) {
          showToast({
            heading: "Failed",
            message: errorResponse.data.message,
            type: "error",
          });
          return;
        }

        if (successResponse) {
          showToast({
            heading: "Success",
            message: "You are now signed in to your account.",
            type: "success",
          });
          dispatch(getUser({ isLoggedIn: true }));
          navigate("/");
        }
      } catch (err) {
        console.error(
          "Error exchanging code:",
          err?.response?.data || err.message
        );
        showToast({
          heading: "Error",
          message: "Something went wrong while signing in.",
          type: "error",
        });
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      showToast({
        heading: "Login Failed",
        message: "Could not initiate Google login.",
        type: "error",
      });
    },
  });

  return (
    <nav className="w-full px-5 py-2 border-b flex items-center justify-between bg-pink-50 bg-opacity-0 border-light sticky top-0 z-[1005] backdrop-b">
      <Logo />

      <div className="flex items-center gap-2 justify-end w-full ">
        {user ? (
          <DropdownMenu
            username={user?.data.username}
            email={user?.data.email}
            profileURL={user?.data.profile_url}
            dropdownContent={dropdownContent}
          />
        ) : (
          <Button
            className={
              "flex items-center hover:bg-custom-green hover:bg-opacity-10"
            }
            handler={googleOAuthHandler}
            buttonType={"PRIMARY"}
          >
            <GoogleIcon className="mr-2" style={{ fontSize: "1.2rem" }} />
            Sign up
          </Button>
        )}
      </div>

      {isDialogOpen && (
        <Dialogue
          title={"Sign out from account"}
          description={
            "Are you sure you want to sign out from your account? You will not be able to use your assistant."
          }
          buttonText={"Sign out"}
          isOpen={isDialogOpen}
          onClose={closeDialogHandler}
          handler={signoutHandler}
        />
      )}
    </nav>
  );
};

export default Navbar;
