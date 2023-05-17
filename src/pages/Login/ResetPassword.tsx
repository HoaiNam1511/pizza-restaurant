import React, { useState } from "react";
import classNames from "classnames/bind";

import * as authService from "../../services/authService";
import * as globalInterface from "../../types";
import * as selectorState from "../../redux/selector";

import styles from "./Login.module.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import CheckboxCustom from "../../components/CheckboxCustom/CheckboxCustom";

const cx = classNames.bind(styles);

function ResetPassword() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<string>();
    const [showPassword, setShowPassword] = useState<string>("password");
    const setInfoAccountReset = useSelector(
        selectorState.selectInfoAccountReset
    );
    const [newPassword, setNewPassword] =
        useState<globalInterface.PasswordReset>({
            password: "",
            confirmPassword: "",
        });
    const [message, setMessage] = useState<string>();
    const { password, confirmPassword } = newPassword;

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword({
            ...newPassword,
            [event.target.name]: event.target.value,
        });
    };

    const handleKeyDown = (event: React.KeyboardEvent): void => {
        if (event.key === " ") {
            event.preventDefault();
        }
    };

    const handleResetPassword = async () => {
        if (String(newPassword.password).length >= 8) {
            if (password === confirmPassword) {
                try {
                    const result = await authService.reset({
                        username: setInfoAccountReset?.username as string,
                        email: setInfoAccountReset?.email as string,
                        newPassword: confirmPassword,
                    });

                    if (result.status) {
                        setStatus(result.status);
                        setMessage(result.message);
                    }
                } catch (err) {
                    console.log(err);
                }
            } else {
                setMessage(
                    "The confirmed password does not match the original password. Please try again"
                );
            }
        } else {
            setMessage("Password require 8 character");
        }
    };

    const handleChangeForm = () => {
        navigate(config.routes.login);
    };

    return (
        <div className={cx("wrapper")}>
            <div className={cx("container")}>
                <form action="">
                    <h1>Reset Password</h1>
                    <input
                        className={cx("input")}
                        placeholder="Password"
                        name="password"
                        value={password}
                        type={showPassword}
                        onChange={(e) => onInputChange(e)}
                        onKeyDown={handleKeyDown}
                    ></input>
                    <input
                        className={cx("input")}
                        placeholder="Confirm password"
                        name="confirmPassword"
                        value={confirmPassword}
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
                            onClick={handleChangeForm}
                        >
                            Back to login
                        </p>
                    </div>

                    <p
                        className={cx("error-message", {
                            "success-message": status,
                        })}
                    >
                        {message}
                    </p>
                    <button
                        type="button"
                        className={cx("btn btn-primary", "btn-login")}
                        onClick={handleResetPassword}
                    >
                        Reset
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
