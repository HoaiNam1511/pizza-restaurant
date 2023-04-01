import styles from "./ProductModal.module.scss";
import classNames from "classnames/bind";
import Modal from "../Modal/Modal";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import { Product } from "../../../pages/Product/Product";
import { createProduct } from "../../../services/productService";
const cx = classNames.bind(styles);

function ProductModal() {
    const [product, setProduct] = useState<Product>({
        id: 0,
        name: "",
        price: 0,
        material: "",
        description: "",
        image: null,
    });

    const { id, name, price, material, description, image } = product;

    let productData: any = new FormData();

    const productDetail = [
        {
            label: "Name",
            name: "name",
            placeholder: "Product name",
        },
        {
            label: "Price",
            name: "price",
            placeholder: "Price",
        },
        {
            label: "Material",
            name: "material",
            placeholder: "Material",
        },
    ];

    const handleUploadFile = (event: any): void => {
        setProduct({ ...product, image: event.target.files?.[0] });
    };

    const handleProductChange = (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ): void => {
        setProduct({ ...product, [event.target.name]: event.target.value });
    };

    const addProductFormData = () => {
        productData.append("name", name);
        productData.append("price", price);
        productData.append("material", material);
        productData.append("description", description);
        productData.append("image", image);
    };

    const create = async (): Promise<any> => {
        addProductFormData();
        try {
            await createProduct(productData);
        } catch (err) {
            console.log(err);
        }
    };

    const handleCreateProduct = () => {
        create();
    };

    return (
        <Modal>
            <div
                className={cx(
                    "d-flex flex-column justify-content-between",
                    "wrapper-content"
                )}
            >
                <form className={cx("form")} action="">
                    {productDetail.map((product, index) => (
                        <div className={cx("form-item")} key={index}>
                            <label className={cx("label")} htmlFor="">
                                {product.label}
                            </label>
                            <input
                                name={product.name}
                                className={cx("input")}
                                type="text"
                                placeholder={product.placeholder}
                                onChange={(e) => handleProductChange(e)}
                            />
                        </div>
                    ))}
                    <div className={cx("form-item")}>
                        <label className={cx("label")} htmlFor="">
                            Description
                        </label>
                        <textarea
                            name="description"
                            className={cx("input", "aria")}
                            placeholder="Description"
                            onChange={(e) => handleProductChange(e)}
                        />
                    </div>
                    <div className={cx("row g-0", "image-container")}>
                        <input
                            type="file"
                            multiple={false}
                            id="upload"
                            onChange={(e) => handleUploadFile(e)}
                            className={cx("d-none", "upload")}
                        />
                        <label
                            htmlFor="upload"
                            className={cx(
                                "col-5 d-flex flex-column justify-content-center align-items-center",
                                "upload-container"
                            )}
                        >
                            <CloudUploadIcon className={cx("upload-icon")} />
                            <div className={cx("upload-title")}>
                                Choose image
                            </div>
                        </label>
                        <div className={cx("col-7")}>
                            {product.image ? (
                                <img
                                    className={cx("image")}
                                    src={URL.createObjectURL(product.image)}
                                    alt=""
                                />
                            ) : (
                                // <img
                                //     className={cx("image")}
                                //     src={emptyImg}
                                //     alt=""
                                // />
                                <ImageSearchIcon
                                    className={cx("empty-image")}
                                />
                            )}
                        </div>
                    </div>
                </form>
                <button
                    type="button"
                    className={cx("btn btn-outline-primary", "btn-add")}
                    onClick={handleCreateProduct}
                >
                    Add
                </button>
            </div>
        </Modal>
    );
}

export default ProductModal;
