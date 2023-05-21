import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as authService from "../../services/authService";
import * as globalInterface from "../../types";
import * as selectorState from "../../redux/selector";

import styles from "./Login.module.scss";
import {
    loginStart,
    loginSuccess,
    loginFail,
    setInfoAccountReset,
} from "../../redux/slice/authSlice";
import {
    setLoadingRequest,
    setLoadingResponse,
} from "../../redux/slice/globalSlice";
import config from "../../config";
import CheckboxCustom from "../../components/CheckboxCustom/CheckboxCustom";
import Loading from "../../components/Loading/Loading";

const cx = classNames.bind(styles);

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>();
    const [form, setForm] = useState<number>(0);
    const [showPassword, setShowPassword] = useState<string>("password");
    const selectLoading: boolean = useSelector(selectorState.selectLoading);
    const [account, setAccount] = useState<globalInterface.Account>({
        username: "",
        password: "",
    });
    const [emailObj, setEmailObj] = useState<globalInterface.EmailForgot>({
        email: "",
    });
    const { email } = emailObj;
    const { username, password } = account;

    const handleLogin = async (): Promise<void> => {
        if (String(account.password).length >= 8) {
            dispatch(loginStart());
            dispatch(setLoadingRequest());
            try {
                const result = await authService.login(account);
                dispatch(setLoadingResponse());
                if (result.data?.token) {
                    dispatch(loginSuccess(result?.data));
                    navigate(config.routes.dashboard);
                }
                setMessage(result.data.message);
            } catch (error) {
                dispatch(loginFail());
            }
        } else {
            setMessage("Password require 8 character");
        }
    };

    const handleForgotPassword = async (): Promise<void> => {
        try {
            dispatch(setLoadingRequest());
            const result = await authService.forgot(emailObj);
            dispatch(setLoadingResponse());
            if (result.message) {
                setMessage(result.message);
            } else {
                dispatch(setInfoAccountReset(result.data));
                navigate(config.routes.reset);
            }
        } catch (error) {
            dispatch(loginFail());
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent): void => {
        if (event.key === " ") {
            event.preventDefault();
        }
    };

    const onInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        if (event.target.name !== "email") {
            setAccount({ ...account, [event.target.name]: event.target.value });

            if (message) {
                setMessage("");
            }
        } else {
            setEmailObj({ ...emailObj, email: event.target.value });
        }
    };

    useEffect(() => {
        if (message) {
            setMessage("");
        }
    }, [form]);

    return (
        <div className={cx("wrapper")}>
            <div className={cx("container")}>
                {form === 0 ? (
                    <form action="">
                        <h1>Pizza Restaurant</h1>
                        <input
                            className={cx("input")}
                            placeholder="Username"
                            name="username"
                            value={username}
                            onChange={(e) => onInputChange(e)}
                            onKeyDown={handleKeyDown}
                        ></input>
                        <input
                            className={cx("input")}
                            placeholder="Password"
                            name="password"
                            value={password}
                            type={showPassword}
                            onChange={(e) => onInputChange(e)}
                            onKeyDown={handleKeyDown}
                        ></input>

                        <div className={cx("form-input-flex")}>
                            <CheckboxCustom
                                id="showPass"
                                onChange={(e) =>
                                    setShowPassword((pre) =>
                                        pre === "password" ? "text" : "password"
                                    )
                                }
                                value=""
                                labelRight
                                label="Show password"
                            />
                            <p
                                className={cx("forgot-password")}
                                onClick={() =>
                                    setForm((pre) => (pre !== 0 ? 0 : 1))
                                }
                            >
                                Forgot your password?
                            </p>
                        </div>

                        <p className={cx("error-message")}>{message}</p>
                        <button
                            type="button"
                            className={cx("btn btn-primary", "btn-login")}
                            onClick={handleLogin}
                        >
                            <span className={cx("btn-title")}>
                                Login
                                {selectLoading && (
                                    <Loading
                                        className={cx("login-loading")}
                                        size="small"
                                    />
                                )}
                            </span>
                        </button>
                    </form>
                ) : (
                    <form action="">
                        <h1>Forgot password</h1>
                        <input
                            className={cx("input")}
                            placeholder="Your email"
                            name="email"
                            value={email}
                            onChange={(e) => onInputChange(e)}
                            onKeyDown={handleKeyDown}
                        ></input>
                        <p
                            className={cx("forgot-password")}
                            onClick={() =>
                                setForm((pre) => (pre === 1 ? 0 : 1))
                            }
                        >
                            Back to login
                        </p>
                        <p className={cx("error-message")}>{message}</p>
                        <button
                            type="button"
                            className={cx("btn btn-primary", "btn-login")}
                            onClick={handleForgotPassword}
                        >
                            <span className={cx("btn-title")}>
                                Find
                                {selectLoading && (
                                    <Loading
                                        className={cx("login-loading")}
                                        size="small"
                                    />
                                )}
                            </span>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Login;
