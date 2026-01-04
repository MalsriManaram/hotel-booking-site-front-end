import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api/";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    prepareHeaders: async (headers, { getState }) => {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: () => "hotels",
    }),
    getHotelsForSearchQuery: builder.query({
      query: ({ description, rating, location, price }) => ({
        url: "hotels/search/retrieve",
        method: "GET",
        params: { description, rating, location, price },
      }),
    }),
    getHotelById: builder.query({
      query: (id) => `hotels/${id}`,
    }),
    getBookingsbyUserId: builder.query({
      query: (userId) => `bookings/users/${userId}`,
    }),
    getBookingsbyHotelId: builder.query({
      query: (hotelId) => `bookings/hotels/${hotelId}`,
    }),
    createHotel: builder.mutation({
      query: (hotel) => ({
        url: "hotels",
        method: "POST",
        body: hotel,
      }),
    }),
    createBooking: builder.mutation({
      query: (booking) => ({
        url: "bookings",
        method: "POST",
        body: booking,
      }),
    }),
    cancelBooking: builder.mutation({
      query: (booking) => ({
        url: `bookings/cancel`,
        method: "POST",
        body: booking,
      }),
    }),
    createContact: builder.mutation({
      query: (contact) => ({
        url: "contacts",
        method: "POST",
        body: contact,
      }),
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelsForSearchQueryQuery,
  useGetHotelByIdQuery,
  useGetBookingsbyUserIdQuery,
  useGetBookingsbyHotelIdQuery,
  useCreateHotelMutation,
  useCreateBookingMutation,
  useCancelBookingMutation,
  useCreateContactMutation,
} = api;
