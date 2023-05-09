import * as globalInterface from "../types";
import { Product } from "../types";

export const createProduct = async (
    { headers, axiosJWT }: globalInterface.ServiceParams,
    { product }: { product: Product<File | null> }
) => {
    const res = await axiosJWT.post("/product/create", product, { headers });
    return res.data;
};

export const getAllProduct = async ({
    page,
    sortBy,
    orderBy,
    headers,
    axiosJWT,
}: globalInterface.ServiceParams) => {
    const res = await axiosJWT.get(
        `/product/get?page=${page}&sortBy=${sortBy}&orderBy=${orderBy}`,
        { headers }
    );
    return res.data;
};

export const updateProduct = async (
    { headers, axiosJWT }: globalInterface.ServiceParams,
    { product, id }: { id: number; product: Product<File | null | string> }
) => {
    const res = await axiosJWT.put(`/product/update/${id}`, product, {
        headers,
    });
    return res.data;
};

export const deleteProduct = async (
    { headers, axiosJWT }: globalInterface.ServiceParams,
    { id }: { id: number }
) => {
    const res = await axiosJWT.delete(`/product/delete/${id}`, { headers });
    return res.data;
};
