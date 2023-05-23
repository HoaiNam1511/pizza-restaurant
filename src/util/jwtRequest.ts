import jwt_decode from "jwt-decode";
import axios from "axios";
import { httpRequest } from "./httpRequest";
import * as globalInterface from "../types";

const refreshToken = async (currentAccount: globalInterface.CurrentAccount) => {
    try {
        //If have cookies will get cookies to request
        const res = await httpRequest.post(
            "auth/refresh",
            {},
            {
                headers: { username: currentAccount.account.username },
            }
        );
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
//Axios request with refresh token check
export const axiosCreateJWT = (
    currentAccount: any,
    dispatch: any,
    stateSuccess: any
) => {
    const axiosJWT = axios.create({
        baseURL: process.env.REACT_APP_SERVER_URL,
    });

    axiosJWT.interceptors.request.use(
        async (config) => {
            let date = new Date();
            //Get decode access token
            const decodeToken: any = jwt_decode(currentAccount?.token);
            //Check token had expired
            if (decodeToken.exp < date.getTime() / 1000) {
                const data = await refreshToken(currentAccount);
                //New access token
                const refreshUser = {
                    ...currentAccount,
                    token: data?.token,
                };
                // console.log("This is new token");
                // console.log(data);
                dispatch(stateSuccess(refreshUser));
                config.headers["token"] = data?.token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return axiosJWT;
};
