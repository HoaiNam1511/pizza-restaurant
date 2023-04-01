import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slice/productSlice";

export const store = configureStore({
    reducer: {
        productReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
