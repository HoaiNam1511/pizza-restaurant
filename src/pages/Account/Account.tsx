import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Account.module.scss";
import ArrowSort from "../../components/ArrowSort/ArrowSort";
import SelectAction from "../../components/SelectAction/SelectAction";
import AccountModal from "../../components/Modals/AccountModal/AccountModal";

import * as selectorState from "../../redux/selector";
import * as accountServices from "../../services/accountService";
import * as globalInterface from "../../types";

import {
    modalCreate,
    openModal,
    modalUpdate,
    reloadFunc,
    addPageCount,
    setToast,
} from "../../redux/slice/globalSlice";
import { ActionButton } from "../../components/Buttons";
import { setAccountDetail } from "../../redux/slice/accountSlice";
import { loginSuccess } from "../../redux/slice/authSlice";
import { axiosCreateJWT } from "../../util/jwtRequest";

const cx = classNames.bind(styles);

function User() {
    const dispatch = useDispatch();

    const [accounts, setAccounts] = useState<globalInterface.AccountData[]>([]);

    const pageChange = useSelector(selectorState.selectCurrentPage);
    const reload = useSelector(selectorState.selectReload);
    const currentAccount = useSelector(selectorState.selectCurrentAccount);

    //Handle create booking
    const handleCreateBooking = (): void => {
        dispatch(modalCreate());
        dispatch(openModal());
    };

    //Api
    const getAccount = async ({ orderBy = "DESC", sortBy = "id" }) => {
        try {
            let page = pageChange;
            const res = await accountServices.get({
                page,
                orderBy,
                sortBy,
                headers: { token: currentAccount?.token },
                axiosJWT: axiosCreateJWT(
                    currentAccount,
                    dispatch,
                    loginSuccess
                ),
            });
            setAccounts(res.data);
            dispatch(addPageCount(res.totalPage));
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await accountServices.deleteAccount(
                {
                    headers: { token: currentAccount?.token },

                    axiosJWT: axiosCreateJWT(
                        currentAccount,
                        dispatch,
                        loginSuccess
                    ),
                },
                {
                    id: id,
                }
            );
            dispatch(reloadFunc());
            dispatch(setToast(res));
        } catch (err) {
            console.log(err);
        }
    };

    //Handle update
    const update = (account: globalInterface.AccountData): void => {
        dispatch(setAccountDetail(account));
        dispatch(modalUpdate());
        dispatch(openModal());
    };

    useEffect(() => {
        getAccount({ orderBy: "DESC", sortBy: "id" });
    }, [reload, pageChange]);

    return (
        <div className={cx("row g-0", "wrapper")}>
            <AccountModal />
            <div className={cx("content")}>
                <div className={cx("d-flex justify-content-between", "header")}>
                    <h2 className={cx("header_title")}>Table account</h2>
                    <div>
                        <button
                            onClick={handleCreateBooking}
                            type="button"
                            className={cx(
                                "btn btn-outline-primary",
                                "header_btn--outline"
                            )}
                        >
                            Add
                        </button>
                    </div>
                </div>
                <section className={cx("table-container")}>
                    <table className={cx("table")}>
                        <thead>
                            <tr className={cx("row g-0")}>
                                <th className={cx("col-2")}>#</th>
                                <th className={cx("col-3")}>Email</th>
                                <th className={cx("col-2")}>Role</th>
                                <th className={cx("col-2")}>Status</th>
                                <th className={cx("col-3")}>Action</th>
                            </tr>
                        </thead>
                        {accounts?.map((account, index) => (
                            <tbody key={index}>
                                <tr className={cx("row g-0")}>
                                    <th scope="row" className={cx("col-2")}>
                                        {index}
                                    </th>

                                    <td className={cx("col-3")}>
                                        {account?.email}
                                    </td>

                                    <td className={cx("col-2")}>
                                        {account?.role[0]?.name}
                                    </td>
                                    <td className={cx("col-2")}>
                                        {+account.status === 1
                                            ? "Enable"
                                            : "Disable"}
                                    </td>

                                    <td className={cx("col-3")}>
                                        <ActionButton
                                            onClick={() => update(account)}
                                            type="update"
                                        />
                                        <ActionButton
                                            onClick={() =>
                                                handleDelete(account.id)
                                            }
                                            type="delete"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </section>
            </div>
        </div>
    );
}

export default User;
