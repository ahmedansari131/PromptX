import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Layout, Toast } from "./components";
import { Landing, Chat } from "./pages";
import { store } from "./app/store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<Chat />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <Toast />
      <RouterProvider router={router} />
    </Provider>
  </GoogleOAuthProvider>
);
