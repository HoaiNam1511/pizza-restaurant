interface OrderStatus {
    title: string;
    value: string;
}
interface ColumnTabeOrder {
    orderDate: string;
    quantity: string;
    total: string;
    id: string;
    price: string;
    bookingDate: any;
    bookingTime: any;
}

export interface PartySizeData {
    title: string;
    value: number;
    quantity: number;
}

export const orderStatusData: OrderStatus[] = [
    { title: "Pending", value: "pending" },
    { title: "Confirmed", value: "confirm" },
    { title: "Shipping", value: "shipping" },
    { title: "Shipped", value: "shipped" },
    { title: "Cancel", value: "cancel" },
];

export const paymentStatusData: OrderStatus[] = [
    { title: "Unpaid", value: "unpaid" },
    { title: "Paid", value: "paid" },
];

export const columnTable: ColumnTabeOrder = {
    orderDate: "order_date",
    quantity: "quantity",
    total: "total",
    id: "id",
    price: "price",
    bookingDate: "booking_date",
    bookingTime: "booking_time",
};

export const bookingStatusData: OrderStatus[] = [
    { title: "Pending", value: "pending" },
    { title: "Eating", value: "eat" },
    { title: "Done", value: "done" },
    { title: "Cancel", value: "cancel" },
];

export const partySizeData: PartySizeData[] = [
    { title: "1 people", value: 1, quantity: 0 },
    { title: "2 people", value: 2, quantity: 0 },
    { title: "3 people", value: 3, quantity: 0 },
    { title: "4 people", value: 4, quantity: 0 },
    { title: "6 people", value: 6, quantity: 0 },
    { title: "8 people", value: 8, quantity: 0 },
];
