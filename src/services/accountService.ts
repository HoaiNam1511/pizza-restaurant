import * as globalInterface from "../types";

export const get = async ({
    page = 1,
    orderBy,
    sortBy,
    headers,
    axiosJWT,
}: globalInterface.ServiceParams) => {
    const res = await axiosJWT.get(
        `/account/get?page=${page}&sortBy=${sortBy}&orderBy=${orderBy}`,
        { headers }
    );
    return res.data;
};

export const create = async (
    { headers, axiosJWT }: globalInterface.ServiceParams,
    { account }: { account: globalInterface.AccountState }
) => {
    const result = await axiosJWT.post("/account/create", account, { headers });
    return result.data;
};

export const update = async (
    { headers, axiosJWT }: globalInterface.ServiceParams,
    { id, account }: { id: number; account: globalInterface.AccountState }
) => {
    const result = await axiosJWT.put(`/account/update/${id}`, account, {
        headers,
    });
    return result.data;
};

export const deleteAccount = async (
    { headers, axiosJWT }: globalInterface.ServiceParams,
    { id }: { id: number }
) => {
    const result = await axiosJWT.delete(`/account/delete/${id}`, { headers });
    return result.data;
};
