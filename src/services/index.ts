import { OrderStatus } from "../pages/Order/Order";

export interface Params {
    page?: number;
    sortBy?: string;
    orderBy?: string;
}

export interface OrderUpdate {
    id: number | null;
    order: OrderStatus;
}
