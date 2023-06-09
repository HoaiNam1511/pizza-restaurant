import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";

import Modal from "../Modal/Modal";
import styles from "./AccountModal.module.scss";
import InputForm from "../../InputForm/InputForm";

import * as staticData from "../../../data/index";
import * as selectorState from "../../../redux/selector";
import * as globalInterface from "../../../types";
import * as authServices from "../../../services/authService";
import * as accountServices from "../../../services/accountService";
import * as globalAction from "../../../redux/slice/globalSlice";

import { axiosCreateJWT } from "../../../util/jwtRequest";
import { loginSuccess } from "../../../redux/slice/authSlice";

const accountInit: globalInterface.AccountState = {
    email: "",
    username: "",
    password: "",
    status: staticData.accountStatus[0].value,
    role: 0,
};

const cx = classNames.bind(styles);
function AccountModal() {
    const refSelect = useRef<any>(null);
    const dispatch = useDispatch();

    const [account, setAccount] =
        useState<globalInterface.AccountState>(accountInit);
    const [roles, setRoles] = useState<globalInterface.Role[]>([]);
    const { email, username, password, status, role } = account;

    const modalTitle: string = useSelector(
        selectorState.selectModalTitleStatus
    );

    const currentAccount: globalInterface.CurrentAccount | null = useSelector(
        selectorState.selectCurrentAccount
    );
    const accountUpdate: globalInterface.AccountData | null = useSelector(
        selectorState.selectAccountDetail
    );
    //Handle when input change
    const handleInputChange = (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setAccount({ ...account, [event.target.name]: event.target.value });
    };

    //Api: create account
    const create = async (): Promise<void> => {
        try {
            dispatch(globalAction.setLoadingRequest());
            const res: globalInterface.Toast = await accountServices.create(
                {
                    headers: {
                        token: currentAccount?.token,
                    },
                    axiosJWT: axiosCreateJWT(
                        currentAccount,
                        dispatch,
                        loginSuccess
                    ),
                },
                { account }
            );
            dispatch(globalAction.reloadFunc());
            dispatch(globalAction.setToast(res));
            setAccount(accountInit);
            dispatch(globalAction.setLoadingResponse());
        } catch (err) {
            console.log(err);
        }
    };

    //Api: update account
    const update = async (): Promise<void> => {
        try {
            dispatch(globalAction.setLoadingRequest());
            const res = await accountServices.update(
                {
                    headers: {
                        token: currentAccount?.token,
                        actionAccount: accountUpdate?.username,
                    },
                    axiosJWT: axiosCreateJWT(
                        currentAccount,
                        dispatch,
                        loginSuccess
                    ),
                },
                {
                    id: accountUpdate?.id || 0,
                    account,
                }
            );
            dispatch(globalAction.reloadFunc());
            dispatch(globalAction.setToast(res));
            setAccount(accountInit);
            dispatch(globalAction.setLoadingResponse());
        } catch (err) {
            console.log(err);
        }
    };

    //Api: get role
    const getRole = async () => {
        try {
            const response = await authServices.role({
                headers: {
                    token: currentAccount?.token,
                },

                axiosJWT: axiosCreateJWT(
                    currentAccount,
                    dispatch,
                    loginSuccess
                ),
            });
            setRoles(response);
            setAccount({ ...account, role: response[0].id });
        } catch (err) {
            console.log(err);
        }
    };

    // Handle
    //Handle btn click create or update account
    const handleCreateAndUpdate = (): void => {
        if (modalTitle === process.env.REACT_APP_CREATE_VALUE) {
            create();
        } else {
            update();
        }
    };

    //Set information when update
    const setAccountUpdate = () => {
        if (accountUpdate !== null) {
            setAccount({
                email: accountUpdate.email,
                username: accountUpdate.username,
                password: accountUpdate.password,
                status: accountUpdate.status ? 1 : 0,
                role: accountUpdate?.role[0]?.id,
            });
        }
    };

    useEffect(() => {
        setAccountUpdate();
    }, [accountUpdate]);

    useEffect(() => {
        getRole();
    }, []);

    return (
        <Modal
            headerTitle="Account"
            modalCrud={true}
            onClick={handleCreateAndUpdate}
        >
            <div className={cx("wrapper-content")}>
                <form className={cx("form")} action="">
                    <div className={cx("form-item")}>
                        <InputForm
                            label="Email *"
                            name="email"
                            onChange={(e) => handleInputChange(e)}
                            placeholder="Email"
                            type="text"
                            value={email}
                        />
                    </div>

                    <div className={cx("form-item")}>
                        <InputForm
                            label="Username *"
                            name="username"
                            onChange={(e) => handleInputChange(e)}
                            placeholder="Username"
                            type="text"
                            value={username}
                        />
                    </div>

                    <div className={cx("form-item")}>
                        <InputForm
                            label="Password *"
                            name="password"
                            onChange={(e) => handleInputChange(e)}
                            placeholder="Password"
                            type="text"
                            value={password}
                        />
                    </div>

                    <div className={cx("form-item")}>
                        <label className={cx("label")} htmlFor="">
                            Account status
                        </label>
                        <select
                            className={cx("input")}
                            name="status"
                            onChange={(e) => handleInputChange(e)}
                            value={status}
                        >
                            {staticData.accountStatus?.map((item, index) => (
                                <option
                                    ref={refSelect}
                                    value={item.value}
                                    key={index}
                                >
                                    {item.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={cx("form-item")}>
                        <label className={cx("label")} htmlFor="">
                            Role & Access
                        </label>
                        <select
                            className={cx("input")}
                            name="role"
                            onChange={(e) => handleInputChange(e)}
                            value={role}
                        >
                            {roles?.map((role, index) => (
                                <option
                                    ref={refSelect}
                                    value={role.id}
                                    key={index}
                                >
                                    {`${role.name} - ${role.description}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default AccountModal;
