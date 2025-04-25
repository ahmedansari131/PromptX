import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ``,
    credentials: "include",
  }),
  tagTypes: ["User", "Chat"],
  endpoints: (builder) => ({
    googleSignIn: builder.mutation({
      query: (data) => ({
        url: "http://127.0.0.1:8000/api/v1/auth/callback/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getUser: builder.query({
      query: () => ({
        url: "http://127.0.0.1:8000/api/v1/auth/user/",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    signedOutUser: builder.mutation({
      query: () => ({
        url: "http://127.0.0.1:8000/api/v1/auth/signout/",
        method: "POST",
      }),
      invalidatesTags: ["User"],
      // Invalidate cache and reset state on signout
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(authApi.util.resetApiState());
        } catch (err) {
          console.error("Signout failed", err);
        }
      },
    }),

    chat: builder.mutation({
      query: (data) => ({
        url: "http://127.0.0.1:5000/chat",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    previousChat: builder.query({
      query: () => ({
        url: "http://127.0.0.1:8000/api/v1/chat/chat/",
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
  }),
});

export const {
  useGoogleSignInMutation,
  useGetUserQuery,
  useSignedOutUserMutation,
  useChatMutation,
  usePreviousChatQuery,
  
} = authApi;
