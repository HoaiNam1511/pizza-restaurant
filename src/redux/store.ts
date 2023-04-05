import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slice/productSlice";
import categorySlice from "./slice/categorySlice";
import globalSlice from "./slice/globalSlice";

export const store = configureStore({
    reducer: {
        productReducer: productSlice,
        globalReducer: globalSlice,
        categoryReducer: categorySlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
