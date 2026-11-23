import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchData: {
    query: "",
    description: "",
    rating: "",
    location: "",
    price: "",
    amenities: [],
    checkIn: "",
    checkOut: "",
    sortBy: "ai_match",
  },
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    submit: (state, action) => {
      state.searchData = {
        ...state.searchData,
        ...action.payload,
      };
    },
    resetSearch: (state) => {
      state.searchData = { ...initialState.searchData };
    },
  },
});

export const { submit, resetSearch } = searchSlice.actions;

export default searchSlice.reducer;
