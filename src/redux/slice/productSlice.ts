import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as globalInterface from "../../types";
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
            action: PayloadAction<globalInterface.Product<string>>
        ) => {
            state.productDetail = action.payload;
        },
    },
});

export const { setProductDetail } = productSlice.actions;

export default productSlice.reducer;
