import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../../pages/Order/Order";

interface OrderState {
    orderDetail: Order | null;
}

const orderInitial: OrderState = {
    orderDetail: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState: orderInitial,
    reducers: {
        setOrderDetail: (state: OrderState, action: PayloadAction<Order>) => {
            state.orderDetail = action.payload;
        },
    },
});

export const { setOrderDetail } = orderSlice.actions;
export default orderSlice.reducer;
