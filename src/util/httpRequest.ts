import axios from "axios";

export const httpRequestProduct = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL + "/product",
    withCredentials: true,
});
