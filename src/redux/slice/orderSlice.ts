import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import * as globalInterface from "../../types";
interface OrderState {
    orderDetail: globalInterface.Order | null;
    orderWeek: globalInterface.ChartData[];
    reloadChart: boolean;
}

const orderInitial: OrderState = {
    orderDetail: null,
    orderWeek: [],
    reloadChart: false,
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

        setOrderWeek: (
            state: OrderState,
            action: PayloadAction<globalInterface.ChartData[]>
        ) => {
            if (state.orderWeek.length === 0) {
                state.orderWeek.push(...action.payload);
            }
        },
    },
});

export const { setOrderDetail, setOrderWeek } = orderSlice.actions;
export default orderSlice.reducer;
