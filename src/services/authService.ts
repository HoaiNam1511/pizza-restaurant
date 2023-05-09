import { httpRequestAuth } from "../util/httpRequest";
import * as globalInterface from "../types";

interface ResetInfo extends globalInterface.PasswordResetInfo {
    newPassword: string;
}

export const login = async (account: globalInterface.Account) => {
    const result = await httpRequestAuth.post("/login", account);
    return result.data;
};

export const forgot = async (email: globalInterface.EmailForgot) => {
    const result = await httpRequestAuth.post("/forgot", email);
    return result.data;
};

export const reset = async (resetInfo: ResetInfo) => {
    const result = await httpRequestAuth.post("/reset", resetInfo);
    return result.data;
};

export const role = async ({
    headers,
    axiosJWT,
}: globalInterface.ServiceParams) => {
    const result = await axiosJWT.get("/auth/role", { headers });
    return result.data;
};

export const logout = async ({
    headers,
    axiosJWT,
}: globalInterface.ServiceParams) => {
    const result = await axiosJWT.post("/auth/logout", {}, { headers });
    return result.data;
};
