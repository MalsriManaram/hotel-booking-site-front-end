import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import  userReducer  from "./features/userSlice";

import { api } from "./api";


export const store = configureStore({
// reducer does is combine all the reducers (slices) into one creating a store 
  reducer: {
    user: userReducer, // Add the userSlice reducer 
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});


setupListeners(store.dispatch);
