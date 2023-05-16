import * as globalInterface from "../types";

export const getAll = async ({
    page,
    orderBy,
    sortBy,
    axiosJWT,
    headers,
}: globalInterface.ServiceParams) => {
    const result = await axiosJWT.get(
        `/order/get?page=${page}&sortBy=${sortBy}&orderBy=${orderBy}`,
        { headers }
    );
    return result.data;
};

export const updateOrder = async (
    { axiosJWT, headers }: globalInterface.ServiceParams,
    { id, order }: globalInterface.OrderUpdate
) => {
    const result = await axiosJWT.put(`/order/update/${id}`, order, {
        headers,
    });
    return result.data;
};

export const getOrderOfWeek = async ({
    axiosJWT,
    headers,
}: globalInterface.ServiceParams) => {
    const result = await axiosJWT.get(
        "/order/order-weeks",
        {},
        {
            headers,
        }
    );
    return result.data;
};
