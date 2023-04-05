import styles from "./Product.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetail } from "../../redux/slice/productSlice";
import {
    modalUpdate,
    modalCreate,
    reloadFunc,
    openModal,
} from "../../redux/slice/globalSlice";
import ProductModal from "../../components/Modals/ProductModal/ProductModal";
import { ActionButton } from "../../components/Buttons/index";
import * as productService from "../../services/productService";
import { selectReload, selectCurrentPage } from "../../redux/selector";
import { addPageCount } from "../../redux/slice/globalSlice";

const cx = classNames.bind(styles);

export interface Product<T> {
    id?: number;
    name: string;
    price: number;
    material: string;
    description: string;
    image: T;
    categories: number[];
}

export interface AsyncFunction<T> {
    (): Promise<T>;
}

function Product() {
    const dispatch = useDispatch();
    const [products, setProducts] = useState<Product<string>[]>([]);
    const reload = useSelector(selectReload);
    const pageChange = useSelector(selectCurrentPage);

    const getAllProduct = async (): Promise<void> => {
        const allProduct = await productService.getAllProduct({
            page: pageChange,
        });
        setProducts(allProduct.data);
        dispatch(addPageCount(allProduct.totalPage));
    };

    const handleCreateProduct = (): void => {
        dispatch(modalCreate());
        dispatch(openModal());
    };

    const handleUpdateProduct = (product: Product<string>): void => {
        dispatch(setProductDetail(product));
        dispatch(modalUpdate());
        dispatch(openModal());
    };

    const handleDeleteProduct = async (id: number): Promise<void> => {
        await productService.deleteProduct(id);
        dispatch(reloadFunc());
    };

    useEffect(() => {
        getAllProduct();
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
                    <h2 className={cx("product-header_title")}>Tabe Product</h2>
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
                                <th className={cx("col-1")}>#</th>
                                <th className={cx("col-3")}>Image</th>
                                <th className={cx("col-3")}>Name</th>
                                <th className={cx("col-2")}>Price</th>
                                <th className={cx("col-3")}>Action</th>
                            </tr>
                        </thead>
                        {products?.map((product, index) => (
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
                </section>
            </div>
        </div>
    );
}

export default Product;
