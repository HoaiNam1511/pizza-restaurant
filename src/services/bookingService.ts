import { httpRequestBooking, httpRequestTable } from "../util/httpRequest";
import * as globalInterface from "../types";

export const get = async ({
    page = 1,
    sortBy,
    orderBy,
    headers,
    axiosJWT,
    status,
}: globalInterface.ServiceParams) => {
    const res = await axiosJWT.get(
        `/booking/get?page=${page}&sortBy=${sortBy}&orderBy=${orderBy}&status=${status}`,
        { headers }
    );
    return res.data;
};

export const getTable = async ({ used }: { used?: boolean }) => {
    const res = await httpRequestTable.get(`/get?used=${used}`);
    return res.data;
};

export const getAllTable = async () => {
    const res = await httpRequestTable.get("/get");
    return res.data;
};

export const create = async (booking: globalInterface.Booking) => {
    const res = await httpRequestBooking.post("/create", booking);
    return res.data;
};

export const update = async (
    { headers, axiosJWT }: globalInterface.ServiceParams,
    { booking, id }: { booking: globalInterface.Booking; id: number }
) => {
    const res = await axiosJWT.put(`/booking/update/${id}`, booking, {
        headers,
    });
    return res.data;
};

export const bookingWeek = async ({
    headers,
    axiosJWT,
}: globalInterface.ServiceParams) => {
    const res = await axiosJWT.get("/booking/booking-week", { headers });
    return res.data;
};
