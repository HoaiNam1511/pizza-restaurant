import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slice/productSlice";
import categorySlice from "./slice/categorySlice";
import globalSlice from "./slice/globalSlice";
import orderSlice from "./slice/orderSlice";
import bookingSlice from "./slice/bookingSlice";

export const store = configureStore({
    reducer: {
        productReducer: productSlice,
        globalReducer: globalSlice,
        categoryReducer: categorySlice,
        orderReducer: orderSlice,
        bookingReducer: bookingSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
