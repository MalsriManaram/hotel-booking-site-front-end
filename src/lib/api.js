import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://stay-hotel-booking-site-backend-malsri.vercel.app/api/",
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
  useCancelBookingMutation
} = api;