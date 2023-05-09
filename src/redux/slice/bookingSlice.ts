import * as globalInterface from "../../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface BookingState {
    categoryDetail: globalInterface.BookingData | null;
}

const initialState = {
    categoryDetail: {
        id: 0,
        customer_name: "",
        customer_email: "",
        customer_phone: 0,
        booking_date: "",
        booking_time: "",
        booking_status: "",
        party_size: 0,
        note: "",
        table_id: 0,
    },
};

export const categorySlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setBookingDetail: (
            state: BookingState,
            action: PayloadAction<globalInterface.BookingData>
        ) => {
            state.categoryDetail = action.payload;
        },
    },
});

export const { setBookingDetail } = categorySlice.actions;

export default categorySlice.reducer;
