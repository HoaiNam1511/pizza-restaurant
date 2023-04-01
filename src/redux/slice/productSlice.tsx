import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ProductState {
    modalIsOpen: boolean;
}

const initialState: ProductState = {
    modalIsOpen: false,
};

export const counterSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        closeModal: (state) => {
            state.modalIsOpen = false;
        },

        openModal: (state) => {
            state.modalIsOpen = true;
        },
    },
});

export const { closeModal, openModal } = counterSlice.actions;

export default counterSlice.reducer;
