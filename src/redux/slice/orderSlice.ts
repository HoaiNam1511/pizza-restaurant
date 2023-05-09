import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import * as globalInterface from "../../types";
interface OrderState {
    orderDetail: globalInterface.Order | null;
}

const orderInitial: OrderState = {
    orderDetail: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState: orderInitial,
    reducers: {
        setOrderDetail: (
            state: OrderState,
            action: PayloadAction<globalInterface.Order>
        ) => {
            state.orderDetail = action.payload;
        },
    },
});

export const { setOrderDetail } = orderSlice.actions;
export default orderSlice.reducer;
