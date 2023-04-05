import { httpRequestProduct } from "../util/httpRequest";
import { Product } from "../pages/Product/Product";

interface ProductParams {
    page?: number;
    sortBy?: string;
    orderBy?: string;
}

export const createProduct = async (product: Product<File | null>) => {
    const res = await httpRequestProduct.post("/create", product);
    return res.data;
};

export const getAllProduct = async ({
    page,
    sortBy = "id",
    orderBy = "DESC",
}: ProductParams) => {
    console.log(page);
    const res = await httpRequestProduct.get(`/get?page=${page}`);
    return res.data;
};

export const updateProduct = async (
    id: number,
    product: Product<File | null | string>
) => {
    const res = await httpRequestProduct.put(`/update/${id}`, product);
    return res.data;
};

export const deleteProduct = async (id: number) => {
    const res = await httpRequestProduct.delete(`/delete/${id}`);
    return res.data;
};
