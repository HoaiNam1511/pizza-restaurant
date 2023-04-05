import { Category } from "./../pages/Category/Category";
import { httpRequestCategory } from "../util/httpRequest";

interface ProductParams {
    page?: number;
    sortBy?: string;
    orderBy?: string;
}

export const getAll = async () => {
    const res = await httpRequestCategory.get(`/get`);
    return res.data;
};

export const get = async ({
    page = 1,
    sortBy = "id",
    orderBy = "DESC",
}: ProductParams) => {
    const res = await httpRequestCategory.get(`/get?page=${page}`);
    return res.data;
};

export const createCategory = async (category: Category<File | null>) => {
    const res = await httpRequestCategory.post("/create", category);
    return res.data;
};

export const updateCategory = async (
    id: number,
    category: Category<File | null | string>
) => {
    const res = await httpRequestCategory.put(`/update/${id}`, category);
    return res.data;
};

export const deleteCategory = async (id: number) => {
    const res = await httpRequestCategory.delete(`/delete/${id}`);
    return res.data;
};
