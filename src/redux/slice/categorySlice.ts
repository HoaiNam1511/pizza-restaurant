import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import * as globalInterface from "../../types";

interface CategoryState {
    categoryDetail: globalInterface.Category<string | null>;
}

const initialState = {
    categoryDetail: {
        id: 0,
        name: "",
        image: null,
    },
};

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategoryDetail: (
            state: CategoryState,
            action: PayloadAction<globalInterface.Category<string>>
        ) => {
            state.categoryDetail = action.payload;
        },
    },
});

export const { setCategoryDetail } = categorySlice.actions;

export default categorySlice.reducer;
