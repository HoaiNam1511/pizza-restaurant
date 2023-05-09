import { configureStore, combineReducers, Store } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import productSlice from "./slice/productSlice";
import categorySlice from "./slice/categorySlice";
import globalSlice from "./slice/globalSlice";
import orderSlice from "./slice/orderSlice";
import bookingSlice from "./slice/bookingSlice";
import authSlice from "./slice/authSlice";
import accountSlice from "./slice/accountSlice";

// Define the root state type

const persistConfig = {
    key: "auth",
    storage,
    whitelist: ["authReducer"],
};

const reducer = combineReducers({
    productReducer: productSlice,
    globalReducer: globalSlice,
    categoryReducer: categorySlice,
    orderReducer: orderSlice,
    bookingReducer: bookingSlice,
    authReducer: authSlice,
    accountReducer: accountSlice,
});

const persistedReducer = persistReducer(persistConfig, reducer);

// Define the store type
export const store: Store<RootState> = configureStore({
    reducer: persistedReducer,
    //Default middleware
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});
export type RootState = ReturnType<typeof reducer>;
export const persistor = persistStore(store);
