import { Category } from "./../pages/Category/Category";
import { httpRequestBooking, httpRequestTable } from "../util/httpRequest";
import { Booking } from "../pages/Booking/Booking";

interface ProductParams {
    page?: number;
    sortBy?: string;
    orderBy?: string;
}

export const get = async ({
    page = 1,
    sortBy = "id",
    orderBy = "DESC",
}: ProductParams) => {
    const res = await httpRequestBooking.get(`/get?page=${page}`);
    return res.data;
};

export const getTable = async () => {
    const res = await httpRequestTable.get(`/get`);
    return res.data;
};

export const create = async (booking: Booking) => {
    const res = await httpRequestBooking.post("/create", booking);
    return res.data;
};

export const update = async (booking: Booking, id: number) => {
    const res = await httpRequestBooking.put(`/update/${id}`, booking);
    return res.data;
};
