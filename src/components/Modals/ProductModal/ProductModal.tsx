import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";

import styles from "./ProductModal.module.scss";
import Modal from "../Modal/Modal";
import UploadImage from "../../UploadImage/UploadImage";
import InputForm from "../../InputForm/InputForm";

import * as categoryService from "../../../services/categoryService";
import * as globalInterface from "../../../types";
import * as selectorState from "../../../redux/selector";
import * as globalAction from "../../../redux/slice/globalSlice";

import { createProduct, updateProduct } from "../../../services/productService";
import { axiosCreateJWT } from "../../../util/jwtRequest";
import { loginSuccess } from "../../../redux/slice/authSlice";
import CheckboxCustom from "../../CheckboxCustom/CheckboxCustom";

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

    const [product, setProduct] =
        useState<globalInterface.Product<File | string | null>>(productInit);
    const [categoryData, setCategoryData] = useState<
        globalInterface.Category<string | null>[]
    >([]);

    const productDetail: globalInterface.Product<string> | null = useSelector(
        selectorState.selectProductDetail
    );
    const modalTitle: string = useSelector(
        selectorState.selectModalTitleStatus
    );
    const currentAccount: globalInterface.CurrentAccount | null = useSelector(
        selectorState.selectCurrentAccount
    );

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
            dispatch(globalAction.setLoadingRequest());
            addProductFormData();
            const res = await createProduct(
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
                    product: productData,
                }
            );
            dispatch(globalAction.reloadFunc());
            dispatch(globalAction.setToast(res));
            setProduct(productInit);
            dispatch(globalAction.setLoadingResponse());
        } catch (err) {
            console.log(err);
        }
    };

    const update = async (): Promise<void> => {
        try {
            dispatch(globalAction.setLoadingRequest());
            addProductFormData();
            const res = await updateProduct(
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
                    id: productDetail?.id as number,
                    product: productData,
                }
            );
            dispatch(globalAction.reloadFunc());
            dispatch(globalAction.setToast(res));
            dispatch(globalAction.setLoadingResponse());
        } catch (err) {
            console.log(err);
        }
    };

    //Get category
    const getCategory: AsyncFunction<void> = async (): Promise<void> => {
        try {
            const res = await categoryService.getAll();
            setCategoryData(res.data);
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
                categories:
                    productDetail.categories.length > 0
                        ? productDetail.categories?.map(
                              (item: globalInterface.Category<string>) =>
                                  item.id
                          )
                        : [],
            });
        }
    }, [productDetail]);

    return (
        <Modal
            headerTitle="Product"
            modalCrud={true}
            onClick={handleCreateProduct}
        >
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
                            {categoryData.length > 0 &&
                                categoryData?.map((category, index) => (
                                    <CheckboxCustom
                                        key={index}
                                        className={cx("col-3")}
                                        id={category?.id || "id"}
                                        value={category?.id || "id"}
                                        onChange={(e) => handleCheckboxClick(e)}
                                        label={category.name}
                                        checked={
                                            categories.find(
                                                (item) => item === category.id
                                            )
                                                ? true
                                                : false
                                        }
                                    />
                                ))}
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default CategoryModal;
