import { httpRequestOrder } from "../util/httpRequest";
import { Params, OrderUpdate } from "./index";

export const getAll = async ({ page, orderBy, sortBy }: Params) => {
    const result = await httpRequestOrder.get(
        `/get?page=${page}&sortBy=${sortBy}&orderBy=${orderBy}`
    );
    return result.data;
};

export const updateOrder = async ({ id, order }: OrderUpdate) => {
    const result = await httpRequestOrder.put(`/update/${id}`, order);
    return result.data;
};
