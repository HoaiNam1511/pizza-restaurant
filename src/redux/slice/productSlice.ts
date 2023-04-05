import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../pages/Product/Product";

export interface ProductState {
    productDetail: any;
}

const initialState: ProductState = {
    productDetail: {},
};

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProductDetail: (
            state: ProductState,
            action: PayloadAction<Product<string>>
        ) => {
            state.productDetail = action.payload;
        },
    },
});

export const { setProductDetail } = productSlice.actions;

export default productSlice.reducer;
