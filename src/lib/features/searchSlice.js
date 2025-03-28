import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchData: {},
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    submit: (state, action) => {
      state.searchData = action.payload;
    },
  },
});

export const { submit } = searchSlice.actions;

export default searchSlice.reducer;