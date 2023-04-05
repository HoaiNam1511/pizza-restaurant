import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface GlobalState {
    modalTitleStatus: string;
    reload: boolean;
    pageCount: number;
    page: number;
    modalIsOpen: boolean;
}

const initialState: GlobalState = {
    modalTitleStatus: "",
    reload: false,
    pageCount: 0,
    page: 1,
    modalIsOpen: false,
};

export const globalSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        modalCreate: (state: GlobalState) => {
            if (process.env.REACT_APP_CREATE_VALUE) {
                state.modalTitleStatus = process.env.REACT_APP_CREATE_VALUE;
            }
        },

        modalUpdate: (state: GlobalState) => {
            if (process.env.REACT_APP_UPDATE_VALUE) {
                state.modalTitleStatus = process.env.REACT_APP_UPDATE_VALUE;
            }
        },

        reloadFunc: (state) => {
            state.reload = !state.reload;
        },

        addPageCount: (state: GlobalState, action) => {
            state.pageCount = action.payload;
        },

        addPage: (state: GlobalState, action) => {
            state.page = action.payload;
        },

        closeModal: (state: GlobalState) => {
            state.modalIsOpen = false;
        },

        openModal: (state: GlobalState) => {
            state.modalIsOpen = true;
        },
    },
});

export const {
    modalCreate,
    modalUpdate,
    reloadFunc,
    addPageCount,
    addPage,
    closeModal,
    openModal,
} = globalSlice.actions;

export default globalSlice.reducer;
