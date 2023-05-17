import { Action } from "redux";
import axios, { AxiosInstance } from "axios";

type Dispatch<A extends Action = any> = (action: A) => A;
type PromiseFn<T> = () => Promise<T>;
type axiosCreateJWT = (
    currentAccount: AccountState,
    dispatch: Dispatch,
    loginSuccess: () => void
) => PromiseFn<AxiosInstance>;
export interface Sort {
    orderBy?: string;
    sortBy?: string;
}

export interface Account {
    username: number | string;
    password: number | string;
}

export interface OrderStatusData {
    title: string;
    value: string;
}
export interface ColumnTableOrder {
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

export interface TitleValueString {
    title: string;
    value: string;
}

export interface TitleValueNumber {
    title: string;
    value: number;
}

export interface Role {
    id: number;
    name: string;
    description: string;
}

export interface AccountState {
    email: string;
    username: string;
    password: string;
    status: number;
    role: number;
}

export interface AccountData {
    id: number;
    email: string;
    username: string;
    password: string;
    status: number;
    role: [
        {
            id: number;
            name: string;
            description: string;
        }
    ];
}
export interface ServiceParams {
    headers: {
        token: string | undefined;
        auth?: string;
        accountUpdate?: string;
    };
    axiosJWT: any;
    orderBy?: string;
    sortBy?: string;
    page?: number;
    status?: string;
}

export interface OrderStatus {
    id: number | null;
    paymentMethod: string;
    orderStatus: string;
    paymentStatus: string;
}

export interface OrderUpdate {
    id: number | null;
    order: OrderStatus;
}

export interface BookingData {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: number;
    booking_date: any;
    booking_time: any;
    booking_status: string;
    party_size: number;
    note: string;
    table_id: number;
}

export interface Category<T> {
    id?: number;
    name: string;
    image: T;
}

export interface Product<T> {
    id?: number;
    name: string;
    price: number;
    material: string;
    description: string;
    image: T;
    categories: number[];
}

export interface Table {
    id: number;
    table_title: string;
    table_size: string;
    table_used: boolean;
}

export interface Booking {
    id?: number;
    customerName: string;
    email: string;
    phone: number;
    date: any;
    time: any;
    partySize: number;
    bookingStatus: string;
    note: string;
    tableId: number;
}

export interface Order {
    id: number;
    order_code: string;
    customer_id: number;
    order_date: string;
    order_status: string;
    payment_method: string;
    payment_status: string;
    customer: {
        id: number;
        name: string;
        email: string;
        address: string;
        phone_number: number;
    };
    products: {
        id: number;
        name: string;
        price: number;
        material: string;
        description: string;
        image: string;
        order_details: {
            id: number;
            order_id: number;
            product_id: number;
            quantity: number;
        };
    }[];
}

export interface NavList {
    to: string;
    title: string;
    icon: any;
}

export interface EmailForgot {
    email: string;
}

export interface PasswordReset {
    password: string;
    confirmPassword: string;
}

export interface PasswordResetInfo {
    username: string;
    email: string;
}
export interface Toast {
    message: string;
    action: string;
}
export interface CardData {
    Icon: any;
    titleHeader: string;
    mainTitle: string | number;
    footerTitle: string;
    cardColor: string;
}

export interface OrderWeekResult {
    orderQuantity: number;
    subTotal: number;
    productSale: number;
}

export interface OrderWeekProduct {
    price: number;
    quantity: number;
}

export interface BookingWeek {
    id: number;
    date: string;
}

export interface OrderWeek extends BookingWeek {
    products: OrderWeekProduct[];
}
export interface ChartData {
    date: string;
    quantity: number;
}
