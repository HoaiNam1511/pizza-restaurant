import styles from "./Category.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    modalUpdate,
    modalCreate,
    reloadFunc,
    openModal,
} from "../../redux/slice/globalSlice";
import CategoryModal from "../../components/Modals/CategoryModal/CategoryModal";
import { ActionButton } from "../../components/Buttons/index";
import * as categoryService from "../../services/categoryService";
import { selectReload, selectCurrentPage } from "../../redux/selector";
import { addPageCount } from "../../redux/slice/globalSlice";
import { setCategoryDetail } from "../../redux/slice/categorySlice";

const cx = classNames.bind(styles);

export interface Category<T> {
    id?: number;
    name: string;
    image: T;
}

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
    const reload = useSelector(selectReload);
    const pageChange = useSelector(selectCurrentPage);
    const [categories, setCategories] = useState<Category<string>[]>([]);

    const getAllCategory = async (): Promise<void> => {
        const allProduct = await categoryService.get({
            page: pageChange,
            sortBy: "id",
            orderBy: "DESC",
        });
        setCategories(allProduct.data);
        dispatch(addPageCount(allProduct.totalPage));
    };

    const handleCreateCategory = (): void => {
        dispatch(modalCreate());
        dispatch(openModal());
    };

    const handleUpdateCategory = (category: Category<string>): void => {
        dispatch(setCategoryDetail(category));
        dispatch(modalUpdate());
        dispatch(openModal());
    };

    const handleDeleteCategory = async (id: number): Promise<void> => {
        await categoryService.deleteCategory(id);
        dispatch(reloadFunc());
    };

    useEffect(() => {
        getAllCategory();
    }, [reload, pageChange]);

    return (
        <div className={cx("row g-0", "wrapper")}>
            <CategoryModal></CategoryModal>
            <div className={cx("category")}>
                <div
                    className={cx(
                        "d-flex justify-content-between",
                        "category-header"
                    )}
                >
                    <h2 className={cx("category-header_title")}>
                        Tabe Category
                    </h2>
                    <button
                        onClick={handleCreateCategory}
                        type="button"
                        className={cx(
                            "btn btn-outline-primary",
                            "category-header_btn"
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
                        {categories?.map((category, index) => (
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
                                                handleUpdateCategory(category)
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
                </section>
            </div>
        </div>
    );
}

export default Category;
