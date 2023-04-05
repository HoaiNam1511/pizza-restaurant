import { createSlice } from "@reduxjs/toolkit";
import { Category } from "../../pages/Category/Category";
import { PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
    categoryDetail: Category<string | null>;
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
            action: PayloadAction<Category<string>>
        ) => {
            state.categoryDetail = action.payload;
        },
    },
});

export const { setCategoryDetail } = categorySlice.actions;

export default categorySlice.reducer;
