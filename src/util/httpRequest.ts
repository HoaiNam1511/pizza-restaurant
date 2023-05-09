import axios from "axios";

export const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    withCredentials: true,
});

export const httpRequestProduct = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL + "/product",
    withCredentials: true,
});

export const httpRequestCategory = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL + "/category",
    withCredentials: true,
});

export const httpRequestOrder = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL + "/order",
    withCredentials: true,
});

export const httpRequestBooking = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL + "/booking",
    withCredentials: true,
});

export const httpRequestTable = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL + "/table",
    withCredentials: true,
});

export const httpRequestAccount = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL + "/account",
    withCredentials: true,
});

export const httpRequestAuth = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL + "/auth",
    withCredentials: true,
});
