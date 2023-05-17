import * as globalInterface from "../types";
import { httpRequestCategory } from "../util/httpRequest";

export const getAll = async () => {
    const res = await httpRequestCategory.get(`/get`);
    return res.data;
};

export const get = async ({
    page = 1,
    sortBy = "id",
    orderBy = "DESC",
    headers,
    axiosJWT,
}: globalInterface.ServiceParams) => {
    const res = await httpRequestCategory.get(
        `/get?page=${page}&orderBy=${orderBy}&sortBy=${sortBy}`
    );
    return res.data;
};

export const createCategory = async (
    { headers, axiosJWT }: globalInterface.ServiceParams,
    { category }: { category: globalInterface.Category<File | null> }
) => {
    const res = await axiosJWT.post("/category/create", category, { headers });
    return res.data;
};

export const updateCategory = async (
    { headers, axiosJWT }: globalInterface.ServiceParams,
    {
        id,
        category,
    }: { id: number; category: globalInterface.Category<File | null | string> }
) => {
    const res = await axiosJWT.put(`/category/update/${id}`, category, {
        headers,
    });
    return res.data;
};

export const deleteCategory = async (
    { headers, axiosJWT }: globalInterface.ServiceParams,
    { id }: { id: number }
) => {
    const res = await axiosJWT.delete(`/category/delete/${id}`, { headers });
    return res.data;
};
