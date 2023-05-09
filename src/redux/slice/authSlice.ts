import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as globalInterface from "../../types";

interface Account {
    id: number;
    email: string;
    username: string;
    status: number;
}

interface CurrentAccount {
    account: Account;
    action: string;
    message: string;
    token: string;
}

interface Logout {
    isFetching: boolean;
    error: boolean;
}

interface Login extends Logout {
    currentAccount: CurrentAccount | null;
}

interface AuthState {
    login: Login;
    logout: Logout;
    infoAccountReset: globalInterface.PasswordResetInfo | null;
}

const initialState: AuthState = {
    login: {
        currentAccount: null,
        error: false,
        isFetching: false,
    },
    logout: {
        error: false,
        isFetching: false,
    },
    infoAccountReset: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart(state: AuthState) {
            state.login.isFetching = true;
        },

        loginSuccess(state: AuthState, action: PayloadAction<CurrentAccount>) {
            state.login.isFetching = false;
            state.login.currentAccount = action.payload;
            state.login.error = false;
        },

        loginFail(state: AuthState) {
            state.login.isFetching = false;
            state.login.error = true;
        },

        logOutStart(state: AuthState) {
            state.login.isFetching = true;
        },

        logOutSuccess(state: AuthState) {
            state.login.isFetching = false;
            state.login.currentAccount = null;
            state.login.error = false;
        },

        logOutFail(state: AuthState) {
            state.login.isFetching = false;
            state.login.error = true;
        },
        setCurrentAccount: (
            state: AuthState,
            action: PayloadAction<CurrentAccount>
        ) => {
            state.login.currentAccount = action.payload;
        },

        setInfoAccountReset: (
            state: AuthState,
            action: PayloadAction<globalInterface.PasswordResetInfo>
        ) => {
            state.infoAccountReset = action.payload;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFail,
    logOutStart,
    logOutSuccess,
    logOutFail,
    setInfoAccountReset,
} = authSlice.actions;

export default authSlice.reducer;
