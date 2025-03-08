import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import  userReducer  from "./features/userSlice";


export const store = configureStore({
// reducer does is combine all the reducers (slices) into one creating a store 
  reducer: {
    user: userReducer, // Add the userSlice reducer 
  },
});


setupListeners(store.dispatch);
