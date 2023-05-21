import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Product.module.scss";
import ArrowSort from "../../components/ArrowSort/ArrowSort";
import ProductModal from "../../components/Modals/ProductModal/ProductModal";
import Loading from "../../components/Loading/Loading";

import * as productService from "../../services/productService";
import * as globalInterface from "../../types";
import * as staticData from "../../data";
import * as globalAction from "../../redux/slice/globalSlice";
import * as selectorState from "../../redux/selector";
import { setProductDetail } from "../../redux/slice/productSlice";
import { ActionButton } from "../../components/Buttons/index";
import { addPageCount } from "../../redux/slice/globalSlice";
import { axiosCreateJWT } from "../../util/jwtRequest";
import { loginSuccess } from "../../redux/slice/authSlice";

const cx = classNames.bind(styles);

export interface AsyncFunction<T> {
    (): Promise<T>;
}

function Product() {
    const dispatch = useDispatch();
    const [products, setProducts] = useState<globalInterface.Product<string>[]>(
        []
    );
    const [loading, setLoading] = useState<boolean>(false);
    const reload: boolean = useSelector(selectorState.selectReload);
    const pageChange: number = useSelector(selectorState.selectCurrentPage);
    const currentAccount: globalInterface.CurrentAccount | null = useSelector(
        selectorState.selectCurrentAccount
    );

    const getAllProduct = async ({
        sortBy = "id",
        orderBy = "DESC",
    }: globalInterface.Sort): Promise<void> => {
        setLoading(true);
        const allProduct = await productService.getAllProduct({
            page: pageChange,
            sortBy,
            orderBy,
            headers: {
                token: currentAccount?.token,
            },
            axiosJWT: axiosCreateJWT(currentAccount, dispatch, loginSuccess),
        });
        setLoading(false);
        setProducts(allProduct.data);
        dispatch(addPageCount(allProduct.totalPage));
    };

    //Handle create
    const handleCreateProduct = (): void => {
        dispatch(globalAction.modalCreate());
        dispatch(globalAction.openModal());
    };

    //Handle update
    const handleUpdateProduct = (
        product: globalInterface.Product<string>
    ): void => {
        dispatch(setProductDetail(product));
        dispatch(globalAction.modalUpdate());
        dispatch(globalAction.openModal());
    };

    //Handle update
    const handleDeleteProduct = async (id: number): Promise<void> => {
        dispatch(globalAction.setLoadingRequestOverlay());
        try {
            const res = await productService.deleteProduct(
                {
                    axiosJWT: axiosCreateJWT(
                        currentAccount,
                        dispatch,
                        loginSuccess
                    ),
                    headers: {
                        token: currentAccount?.token,
                    },
                },
                { id: id }
            );
            dispatch(globalAction.setLoadingResponseOverlay());
            dispatch(globalAction.reloadFunc());
            dispatch(globalAction.setToast(res));
        } catch (err) {
            console.log(err);
        }
    };

    //Sort
    const handleSort = ({ orderBy, sortBy }: globalInterface.Sort): void => {
        getAllProduct({ orderBy, sortBy });
    };

    useEffect(() => {
        getAllProduct({});
    }, [reload, pageChange]);

    return (
        <div className={cx("row g-0", "wrapper")}>
            <ProductModal></ProductModal>
            <div className={cx("product")}>
                <div
                    className={cx(
                        "d-flex justify-content-between",
                        "product-header"
                    )}
                >
                    <h2 className={cx("product-header_title")}>
                        Table Product
                    </h2>
                    <button
                        onClick={handleCreateProduct}
                        type="button"
                        className={cx(
                            "btn btn-outline-primary",
                            "product-header_btn"
                        )}
                    >
                        Add
                    </button>
                </div>
                <section className={cx("table-container")}>
                    <table className={cx("table")}>
                        <thead>
                            <tr className={cx("row g-0")}>
                                <th className={cx("col-1")}>
                                    #
                                    <ArrowSort
                                        onClick={(orderBy) =>
                                            handleSort({
                                                orderBy,
                                                sortBy: staticData.columnTable
                                                    .id,
                                            })
                                        }
                                    />
                                </th>
                                <th className={cx("col-3")}>Image</th>
                                <th className={cx("col-3")}>Name</th>
                                <th className={cx("col-2")}>
                                    Price
                                    <ArrowSort
                                        onClick={(orderBy) =>
                                            handleSort({
                                                orderBy,
                                                sortBy: staticData.columnTable
                                                    .price,
                                            })
                                        }
                                    />
                                </th>
                                <th className={cx("col-3")}>Action</th>
                            </tr>
                        </thead>
                        {!loading &&
                            products?.map((product, index) => (
                                <tbody key={index}>
                                    <tr className={cx("row g-0")}>
                                        <th scope="row" className={cx("col-1")}>
                                            {index}
                                        </th>
                                        <td className={cx("col-3")}>
                                            <img
                                                className={cx("image")}
                                                src={`${process.env.REACT_APP_SERVER_URL}/images/${product.image}`}
                                                alt=""
                                            />
                                        </td>
                                        <td className={cx("col-3")}>
                                            {product.name}
                                        </td>
                                        <td className={cx("col-2")}>
                                            {product.price}
                                        </td>
                                        <td className={cx("col-3")}>
                                            <ActionButton
                                                onClick={() =>
                                                    handleUpdateProduct(product)
                                                }
                                                type="update"
                                            />

                                            <ActionButton
                                                onClick={() =>
                                                    handleDeleteProduct(
                                                        product.id ?? 0
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

export default Product;
