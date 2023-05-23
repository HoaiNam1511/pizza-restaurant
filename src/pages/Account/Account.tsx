import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Account.module.scss";
import Loading from "../../components/Loading/Loading";
import AccountModal from "../../components/Modals/AccountModal/AccountModal";

import * as selectorState from "../../redux/selector";
import * as accountServices from "../../services/accountService";
import * as globalInterface from "../../types";
import * as globalAction from "../../redux/slice/globalSlice";

import { ActionButton } from "../../components/Buttons";
import { setAccountDetail } from "../../redux/slice/accountSlice";
import { loginSuccess } from "../../redux/slice/authSlice";
import { axiosCreateJWT } from "../../util/jwtRequest";

const cx = classNames.bind(styles);

function User() {
    const dispatch = useDispatch();

    const [accounts, setAccounts] = useState<globalInterface.AccountData[]>([]);
    const pageChange: number = useSelector(selectorState.selectCurrentPage);
    const reload: boolean = useSelector(selectorState.selectReload);
    const currentAccount: globalInterface.CurrentAccount | null = useSelector(
        selectorState.selectCurrentAccount
    );
    const [loading, setLoading] = useState<boolean>(false);

    //Handle create booking
    const handleCreateBooking = (): void => {
        dispatch(globalAction.modalCreate());
        dispatch(globalAction.openModal());
    };

    //Api: get account
    const getAccount = async ({
        orderBy = "DESC",
        sortBy = "id",
    }): Promise<void> => {
        try {
            let page: number = pageChange;
            setLoading(true);
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
            setLoading(false);
            setAccounts(res.data);
            dispatch(globalAction.addPageCount(res.totalPage));
        } catch (err) {
            console.log(err);
        }
    };

    //Api: delete account
    const handleDelete = async (
        account: globalInterface.AccountData
    ): Promise<void> => {
        try {
            dispatch(globalAction.setLoadingRequestOverlay());
            const res = await accountServices.deleteAccount(
                {
                    headers: {
                        token: currentAccount?.token,
                        actionAccount: account.username,
                    },

                    axiosJWT: axiosCreateJWT(
                        currentAccount,
                        dispatch,
                        loginSuccess
                    ),
                },
                {
                    id: account.id,
                }
            );
            dispatch(globalAction.setLoadingResponseOverlay());
            dispatch(globalAction.reloadFunc());
            dispatch(globalAction.setToast(res));
        } catch (err) {
            console.log(err);
        }
    };

    //Handle update
    const update = (account: globalInterface.AccountData): void => {
        dispatch(setAccountDetail(account));
        dispatch(globalAction.modalUpdate());
        dispatch(globalAction.openModal());
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

                        {!loading &&
                            accounts?.map((account, index) => (
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
                                                    handleDelete(account)
                                                }
                                                type="delete"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                    </table>
                    {loading && (
                        <Loading
                            size="medium"
                            className={cx("content-loading")}
                        />
                    )}
                </section>
            </div>
        </div>
    );
}

export default User;
