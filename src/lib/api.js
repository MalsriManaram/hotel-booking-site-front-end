import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBase =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api/";
const BACKEND_URL = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    prepareHeaders: async (headers) => {
      try {
        const token = await window.Clerk?.session?.getToken();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      } catch {
        // Proceed unauthenticated when session token is not ready
      }
      return headers;
    },
  }),
  tagTypes: [
    "Hotels",
    "Hotel",
    "Availability",
    "Bookings",
    "Reviews",
    "Wishlist",
    "Contacts",
    "AdminStats",
  ],
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: () => "hotels",
      providesTags: ["Hotels"],
    }),
    getHotelLocations: builder.query({
      query: () => "hotels/locations",
      providesTags: ["Hotels"],
    }),
    getHotelsForSearchQuery: builder.query({
      query: ({
        query,
        description,
        rating,
        location,
        price,
        amenities,
        checkIn,
        checkOut,
        sortBy,
      }) => {
        const params = {};
        if (query) params.query = query;
        if (description) params.description = description;
        if (rating) params.rating = rating;
        if (location && location !== "ALL") params.location = location;
        if (price) params.price = price;
        if (amenities?.length) {
          params.amenities = Array.isArray(amenities)
            ? amenities.join(",")
            : amenities;
        }
        if (checkIn) params.checkIn = checkIn;
        if (checkOut) params.checkOut = checkOut;
        if (sortBy) params.sortBy = sortBy;

        return {
          url: "hotels/search/retrieve",
          method: "GET",
          params,
        };
      },
      providesTags: ["Hotels"],
    }),
    getHotelById: builder.query({
      query: (id) => `hotels/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Hotel", id }],
    }),
    getHotelAvailability: builder.query({
      query: (id) => `hotels/${id}/availability`,
      providesTags: (_res, _err, id) => [{ type: "Availability", id }],
    }),
    createHotel: builder.mutation({
      query: (hotel) => ({
        url: "hotels",
        method: "POST",
        body: hotel,
      }),
      invalidatesTags: ["Hotels", "AdminStats"],
    }),
    updateHotel: builder.mutation({
      query: ({ id, ...hotel }) => ({
        url: `hotels/${id}`,
        method: "PUT",
        body: hotel,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        "Hotels",
        { type: "Hotel", id },
        "AdminStats",
      ],
    }),
    deleteHotel: builder.mutation({
      query: (id) => ({
        url: `hotels/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hotels", "AdminStats"],
    }),
    syncEmbeddings: builder.mutation({
      query: () => ({
        url: "hotels/embeddings/create",
        method: "POST",
      }),
    }),
    getAdminStats: builder.query({
      query: () => "hotels/admin/stats",
      providesTags: ["AdminStats"],
    }),
    sendConciergeMessage: builder.mutation({
      query: (body) => ({
        url: "hotels/concierge",
        method: "POST",
        body,
      }),
    }),

    // Bookings & Promos
    getBookingsbyUserId: builder.query({
      query: (userId) => `bookings/users/${userId}`,
      providesTags: ["Bookings"],
    }),
    getBookingsbyHotelId: builder.query({
      query: (hotelId) => `bookings/hotels/${hotelId}`,
      providesTags: ["Bookings"],
    }),
    getAllBookings: builder.query({
      query: () => "bookings",
      providesTags: ["Bookings"],
    }),
    validatePromo: builder.mutation({
      query: (body) => ({
        url: "bookings/promo/validate",
        method: "POST",
        body,
      }),
    }),
    createBooking: builder.mutation({
      query: (booking) => ({
        url: "bookings",
        method: "POST",
        body: booking,
      }),
      invalidatesTags: (_res, _err, arg) => [
        "Bookings",
        "AdminStats",
        { type: "Availability", id: arg.hotelId },
      ],
    }),
    cancelBooking: builder.mutation({
      query: (booking) => ({
        url: "bookings/cancel",
        method: "POST",
        body: booking,
      }),
      invalidatesTags: ["Bookings", "Availability", "AdminStats"],
    }),
    updateBookingStatusAdmin: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `bookings/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Bookings", "Availability", "AdminStats"],
    }),

    // Reviews
    getReviewsByHotel: builder.query({
      query: (hotelId) => `reviews/hotel/${hotelId}`,
      providesTags: (_res, _err, hotelId) => [{ type: "Reviews", id: hotelId }],
    }),
    upsertReview: builder.mutation({
      query: (body) => ({
        url: "reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Reviews", id: arg.hotelId },
        { type: "Hotel", id: arg.hotelId },
        "Hotels",
      ],
    }),
    deleteReview: builder.mutation({
      query: ({ id }) => ({
        url: `reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Reviews", id: arg.hotelId },
        { type: "Hotel", id: arg.hotelId },
        "Hotels",
      ],
    }),

    // Wishlists
    getWishlist: builder.query({
      query: () => "wishlists",
      providesTags: ["Wishlist"],
    }),
    toggleWishlist: builder.mutation({
      query: (hotelId) => ({
        url: "wishlists/toggle",
        method: "POST",
        body: { hotelId },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // Contacts
    createContact: builder.mutation({
      query: (contact) => ({
        url: "contacts",
        method: "POST",
        body: contact,
      }),
      invalidatesTags: ["Contacts", "AdminStats"],
    }),
    getAllContacts: builder.query({
      query: () => "contacts",
      providesTags: ["Contacts"],
    }),
    updateContactStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `contacts/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Contacts", "AdminStats"],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelLocationsQuery,
  useGetHotelsForSearchQueryQuery,
  useGetHotelByIdQuery,
  useGetHotelAvailabilityQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
  useSyncEmbeddingsMutation,
  useGetAdminStatsQuery,
  useSendConciergeMessageMutation,
  useGetBookingsbyUserIdQuery,
  useGetBookingsbyHotelIdQuery,
  useGetAllBookingsQuery,
  useValidatePromoMutation,
  useCreateBookingMutation,
  useCancelBookingMutation,
  useUpdateBookingStatusAdminMutation,
  useGetReviewsByHotelQuery,
  useUpsertReviewMutation,
  useDeleteReviewMutation,
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useCreateContactMutation,
  useGetAllContactsQuery,
  useUpdateContactStatusMutation,
} = api;
