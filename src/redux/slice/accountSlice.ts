import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as globalInterface from "../../types";

interface AccoutState {
    accountDetail: globalInterface.AccountData | null;
}

const initialState: AccoutState = {
    accountDetail: null,
};

export const authSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setAccountDetail(
            state: AccoutState,
            action: PayloadAction<globalInterface.AccountData>
        ) {
            state.accountDetail = action.payload;
        },
    },
});

export const { setAccountDetail } = authSlice.actions;

export default authSlice.reducer;
