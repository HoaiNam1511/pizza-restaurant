import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

export interface BookingData {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: number;
    booking_date: any;
    booking_time: any;
    booking_status: string;
    party_size: number;
    note: string;
    table_id: number;
}

interface BookingState {
    categoryDetail: BookingData | null;
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
            action: PayloadAction<BookingData>
        ) => {
            state.categoryDetail = action.payload;
        },
    },
});

export const { setBookingDetail } = categorySlice.actions;

export default categorySlice.reducer;
