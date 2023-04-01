import styles from "./Product.module.scss";
import classNames from "classnames/bind";
import Modal from "../../components/Modals/Modal/Modal";
import { useSelector, useDispatch } from "react-redux";
import { openModal } from "../../redux/slice/productSlice";
import { selectStatusModal } from "../../redux/selector";
import ProductModal from "../../components/Modals/ProductModal/ProductModal";

const cx = classNames.bind(styles);

export interface Product {
    id?: number;
    name: string;
    price: number;
    material: string;
    description: string;
    image: File | null;
}

function Product() {
    const dispatch = useDispatch();
    const modalStatus = useSelector(selectStatusModal);

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
                        onClick={() => dispatch(openModal())}
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
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Handle</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Larry the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
}

export default Product;
