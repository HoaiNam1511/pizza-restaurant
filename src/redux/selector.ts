import type { RootState } from "./store";

export const selectProductDetail = (state: RootState) =>
    state.productReducer.productDetail;

//Selector of global

export const selectStatusModal = (state: RootState) =>
    state.globalReducer.modalIsOpen;
export const selectModalTitleStatus = (state: RootState) =>
    state.globalReducer.modalTitleStatus;
export const selectReload = (state: RootState) => state.globalReducer.reload;
export const selectPageCount = (state: RootState) =>
    state.globalReducer.pageCount;
export const selectCurrentPage = (state: RootState) => state.globalReducer.page;

//Select category
export const selectCategoryDetail = (state: RootState) =>
    state.categoryReducer.categoryDetail;
//Select order
export const selectOrderDetail = (state: RootState) =>
    state.orderReducer.orderDetail;
//Select booking
export const selectBookingDetail = (state: RootState) =>
    state.bookingReducer.categoryDetail;
//Select auth
export const selectCurrentAccount = (state: RootState) =>
    state.authReducer.login.currentAccount;
export const selectInfoAccountReset = (state: RootState) =>
    state.authReducer.infoAccountReset;
//Select account
export const selectAccoutDetail = (state: RootState) =>
    state.accountReducer.accountDetail;
