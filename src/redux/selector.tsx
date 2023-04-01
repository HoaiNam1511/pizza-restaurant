import type { RootState } from "./store";

export const selectStatusModal = (state: RootState) =>
    state.productReducer.modalIsOpen;
