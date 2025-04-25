import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://127.0.0.1:5000`,
    credentials: "include",
  }),
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    chat: builder.mutation({
      query: (data) => ({
        url: "/chat",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const { useChatMutation } = chatApi;
