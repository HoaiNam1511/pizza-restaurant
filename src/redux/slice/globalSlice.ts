import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as globalInterface from "../../types";
export interface GlobalState {
    modalTitleStatus: string;
    reload: boolean;
    pageCount: number;
    page: number;
    modalIsOpen: boolean;
    toast: globalInterface.Toast;
    loading: boolean;
    loadingOverlay: boolean;
}

const initialState: GlobalState = {
    modalTitleStatus: "",
    reload: false,
    pageCount: 0,
    page: 1,
    modalIsOpen: false,
    toast: {
        message: "",
        action: "",
    },
    loading: false,
    loadingOverlay: false,
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

        setToast: (
            state: GlobalState,
            actions: PayloadAction<globalInterface.Toast>
        ) => {
            state.toast = actions.payload;
        },

        setLoadingRequest(state: GlobalState) {
            state.loading = true;
        },

        setLoadingResponse(state: GlobalState) {
            state.loading = false;
        },

        setLoadingRequestOverlay(state: GlobalState) {
            state.loadingOverlay = true;
        },

        setLoadingResponseOverlay(state: GlobalState) {
            state.loadingOverlay = false;
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
    setToast,
    setLoadingRequest,
    setLoadingResponse,
    setLoadingRequestOverlay,
    setLoadingResponseOverlay,
} = globalSlice.actions;

export default globalSlice.reducer;
