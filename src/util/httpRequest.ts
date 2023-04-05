import axios from "axios";

export const httpRequestProduct = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL + "/product",
    withCredentials: true,
});

export const httpRequestCategory = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL + "/category",
    withCredentials: true,
});
