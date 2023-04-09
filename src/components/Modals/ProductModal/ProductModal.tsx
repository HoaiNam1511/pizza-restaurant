import { useEffect, useState } from "react";
import classNames from "classnames/bind";

import * as categoryService from "../../../services/categoryService";
import styles from "./ProductModal.module.scss";
import Modal from "../Modal/Modal";
import UploadImage from "../../UploadImage/UploadImage";
import InputForm from "../../InputForm/InputForm";

import { Product } from "../../../pages/Product/Product";
import { createProduct, updateProduct } from "../../../services/productService";
import { Category } from "../../../pages/Category/Category";
import {
    selectProductDetail,
    selectModalTitleStatus,
} from "../../../redux/selector";
import { reloadFunc } from "../../../redux/slice/globalSlice";
import { useSelector, useDispatch } from "react-redux";

const cx = classNames.bind(styles);

type AsyncFunction<T> = () => Promise<T>;

const productInit = {
    id: 0,
    name: "",
    price: 0,
    material: "",
    description: "",
    image: null,
    categories: [],
};

function CategoryModal() {
    let productData: any = new FormData();
    const dispatch = useDispatch();
    const [product, setProduct] = useState<Product<File | null>>(productInit);
    const [categorys, setCategorys] = useState<Category<File | null>[]>([]);
    const productDetail = useSelector(selectProductDetail);
    const modalTitle = useSelector(selectModalTitleStatus);

    const { id, name, price, material, description, image, categories } =
        product;

    //Handle image upload
    const handleUploadFile = (event: any): void => {
        setProduct({ ...product, image: event.target.files?.[0] });
    };

    //Handle when input change
    const handleProductChange = (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ): void => {
        setProduct({ ...product, [event.target.name]: event.target.value });
    };

    //Add to formData
    const addProductFormData = (): void => {
        productData.append("name", name);
        productData.append("price", price);
        productData.append("material", material);
        productData.append("description", description);
        productData.append("image", image);
        productData.append("categories", JSON.stringify(categories));
    };

    //Api
    const create = async (): Promise<void> => {
        try {
            addProductFormData();
            await createProduct(productData);
            dispatch(reloadFunc());
            setProduct(productInit);
        } catch (err) {
            console.log(err);
        }
    };

    const update = async (): Promise<void> => {
        try {
            addProductFormData();
            await updateProduct(productDetail.id, productData);
            dispatch(reloadFunc());
        } catch (err) {
            console.log(err);
        }
    };

    //Get category
    const getCategory: AsyncFunction<void> = async (): Promise<void> => {
        try {
            const res = await categoryService.getAll();
            setCategorys(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    //Handle group category of product
    const handleCheckboxClick = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        if (categories.includes(Number(event.target.value))) {
            setProduct({
                ...product,
                categories: categories.filter(
                    (item) => item !== Number(event.target.value)
                ),
            });
        } else {
            setProduct({
                ...product,
                categories: [...categories, Number(event.target.value)],
            });
        }
    };

    //Handle when button create/update click
    const handleCreateProduct = (): void => {
        if (modalTitle === process.env.REACT_APP_CREATE_VALUE) {
            create();
        } else {
            update();
        }
    };

    useEffect(() => {
        getCategory();
    }, []);

    //Set product detail
    useEffect(() => {
        if (productDetail?.id) {
            setProduct({
                id: productDetail.id,
                name: productDetail.name,
                price: productDetail.price,
                material: productDetail.material,
                description: productDetail.description,
                image: productDetail.image,
                categories: [],
            });
        }
    }, [productDetail]);

    return (
        <Modal headerTitle="Product">
            <div
                className={cx(
                    "d-flex flex-column justify-content-between",
                    "wrapper-content"
                )}
            >
                <form className={cx("form")} action="">
                    <div className={cx("d-flex", "form-flex")}>
                        <div className={cx("form-item")}>
                            <InputForm
                                label="Name"
                                name="name"
                                onChange={(e) => handleProductChange(e)}
                                placeholder="Name"
                                type="text"
                                value={name || ""}
                            />
                        </div>

                        <div className={cx("form-item")}>
                            <InputForm
                                label="Price"
                                name="price"
                                type="text"
                                placeholder="Price"
                                onChange={(e) => handleProductChange(e)}
                                value={price || ""}
                            />
                        </div>
                    </div>
                    <div className={cx("d-flex", "form-flex")}>
                        <div className={cx("form-item")}>
                            <label className={cx("label")} htmlFor="">
                                Material
                            </label>
                            <textarea
                                name="material"
                                className={cx("input", "aria")}
                                placeholder="Material"
                                onChange={(e) => handleProductChange(e)}
                                value={material || ""}
                            />
                        </div>
                        <div className={cx("form-item")}>
                            <label className={cx("label")} htmlFor="">
                                Description
                            </label>
                            <textarea
                                name="description"
                                className={cx("input", "aria")}
                                placeholder="Description"
                                onChange={(e) => handleProductChange(e)}
                                value={description || ""}
                            />
                        </div>
                    </div>

                    <UploadImage
                        onChange={(e) => handleUploadFile(e)}
                        image={image}
                    />

                    <div className={cx("category")}>
                        <label className={cx("label")} htmlFor="">
                            Category group
                        </label>
                        <div className={cx("row g-0", "category-group")}>
                            {categorys.length > 0 &&
                                categorys.map((category, index) => (
                                    <div
                                        className={cx(
                                            "col-3 d-flex justify-content-center align-items-center",
                                            "category-item"
                                        )}
                                        key={index}
                                    >
                                        <label
                                            className={cx("label")}
                                            htmlFor=""
                                        >
                                            {category.name}
                                        </label>

                                        <div className={cx("checkbox-1")}>
                                            <input
                                                type="checkbox"
                                                className={cx("order-ckb")}
                                                id={category.name}
                                                value={category.id || ""}
                                                onChange={(e) =>
                                                    handleCheckboxClick(e)
                                                }
                                            />
                                            <label
                                                htmlFor={category.name}
                                                className={cx(
                                                    "order-ckb-label",
                                                    {
                                                        active: categories?.find(
                                                            (item: any) =>
                                                                item ===
                                                                category.id
                                                        ),
                                                    }
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </form>
                <button
                    type="button"
                    className={cx("btn btn-outline-primary", "btn-add")}
                    onClick={handleCreateProduct}
                >
                    {modalTitle}
                </button>
            </div>
        </Modal>
    );
}

export default CategoryModal;
