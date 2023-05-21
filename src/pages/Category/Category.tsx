import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";

import styles from "./Category.module.scss";
import CategoryModal from "../../components/Modals/CategoryModal/CategoryModal";

import * as categoryService from "../../services/categoryService";
import * as globalInterface from "../../types";

import * as globalAction from "../../redux/slice/globalSlice";
import { ActionButton } from "../../components/Buttons/index";
import * as selectorState from "../../redux/selector";
import { addPageCount } from "../../redux/slice/globalSlice";
import { setCategoryDetail } from "../../redux/slice/categorySlice";
import { axiosCreateJWT } from "../../util/jwtRequest";
import { loginSuccess } from "../../redux/slice/authSlice";
import Loading from "../../components/Loading/Loading";

const cx = classNames.bind(styles);

export const categoryInit = {
    id: 0,
    name: "",
    image: null,
};

export interface AsyncFunction<T> {
    (): Promise<T>;
}

function Category() {
    const dispatch = useDispatch();
    const reload: boolean = useSelector(selectorState.selectReload);
    const pageChange: number = useSelector(selectorState.selectCurrentPage);
    const [categories, setCategories] = useState<
        globalInterface.Category<string>[]
    >([]);
    const currentAccount: globalInterface.CurrentAccount | null = useSelector(
        selectorState.selectCurrentAccount
    );
    const [loading, setLoading] = useState<boolean>(false);

    //Api
    const getAllCategory = async (): Promise<void> => {
        try {
            setLoading(true);
            const allProduct = await categoryService.get({
                page: pageChange,
                sortBy: "id",
                orderBy: "DESC",
                axiosJWT: axiosCreateJWT(
                    currentAccount,
                    dispatch,
                    loginSuccess
                ),
                headers: {
                    token: currentAccount?.token,
                },
            });
            setLoading(false);
            dispatch(globalAction.setLoadingResponse());
            setCategories(allProduct.data);
            dispatch(addPageCount(allProduct.totalPage));
        } catch (err) {
            console.log(err);
        }
    };

    //Handle create
    const handleCreateCategory = (): void => {
        dispatch(globalAction.modalCreate());
        dispatch(globalAction.openModal());
    };

    //Handle update
    const handleUpdateCategory = (
        category: globalInterface.Category<string>
    ): void => {
        dispatch(setCategoryDetail(category));
        dispatch(globalAction.modalUpdate());
        dispatch(globalAction.openModal());
    };

    //Handle delete
    const handleDeleteCategory = async (id: number): Promise<void> => {
        try {
            dispatch(globalAction.setLoadingRequestOverlay());
            const res = await categoryService.deleteCategory(
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
                {
                    id: id,
                }
            );
            dispatch(globalAction.setLoadingResponseOverlay());
            dispatch(globalAction.reloadFunc());
            dispatch(globalAction.setToast(res));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllCategory();
    }, [reload, pageChange]);

    return (
        <div className={cx("row g-0", "wrapper")}>
            <CategoryModal></CategoryModal>
            <div className={cx("content")}>
                <div
                    className={cx(
                        "d-flex justify-content-between",
                        "content-header"
                    )}
                >
                    <h2 className={cx("content-header_title")}>
                        Tabe Category
                    </h2>
                    <button
                        onClick={handleCreateCategory}
                        type="button"
                        className={cx(
                            "btn btn-outline-primary",
                            "content-header_btn"
                        )}
                    >
                        Add
                    </button>
                </div>
                <section className={cx("table-container")}>
                    <table className={cx("table")}>
                        <thead>
                            <tr className={cx("row g-0")}>
                                <th className={cx("col-1")}>#</th>
                                <th className={cx("col-4")}>Image</th>
                                <th className={cx("col-3")}>Name</th>
                                <th className={cx("col-4")}>Action</th>
                            </tr>
                        </thead>
                        {!loading &&
                            categories?.map((category, index) => (
                                <tbody key={index}>
                                    <tr className={cx("row g-0")}>
                                        <th scope="row" className={cx("col-1")}>
                                            {index}
                                        </th>
                                        <td className={cx("col-4")}>
                                            <img
                                                className={cx("image")}
                                                src={`${process.env.REACT_APP_SERVER_URL}/images/${category.image}`}
                                                alt=""
                                            />
                                        </td>
                                        <td className={cx("col-3")}>
                                            {category.name}
                                        </td>

                                        <td className={cx("col-4")}>
                                            <ActionButton
                                                onClick={() =>
                                                    handleUpdateCategory(
                                                        category
                                                    )
                                                }
                                                type="update"
                                            />

                                            <ActionButton
                                                onClick={() =>
                                                    handleDeleteCategory(
                                                        category.id ?? 0
                                                    )
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

export default Category;
