import { useEffect, useState } from "react";
import classNames from "classnames/bind";

import * as categoryService from "../../../services/categoryService";
import styles from "./CategoryModal.module.scss";
import Modal from "../Modal/Modal";
import UploadImage from "../../UploadImage/UploadImage";
import InputForm from "../../InputForm/InputForm";

import { Category } from "../../../pages/Category/Category";
import {
    selectModalTitleStatus,
    selectCategoryDetail,
} from "../../../redux/selector";
import { reloadFunc } from "../../../redux/slice/globalSlice";
import { useSelector, useDispatch } from "react-redux";
import { categoryInit } from "../../../pages/Category/Category";

const cx = classNames.bind(styles);

type AsyncFunction<T> = () => Promise<T>;

function CategoryModal() {
    let formData: any = new FormData();
    const dispatch = useDispatch();
    const [category, setCategory] =
        useState<Category<File | null>>(categoryInit);
    const { id, name, image } = category;

    const categoryDetail = useSelector(selectCategoryDetail);
    const modalTitle = useSelector(selectModalTitleStatus);

    const handleUploadFile = (event: any): void => {
        setCategory({ ...category, image: event.target.files?.[0] });
    };

    //Handle input change
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setCategory({ ...category, [event.target.name]: event.target.value });
    };

    //Add data to formData
    const addFormData = (): void => {
        formData.append("name", name);
        formData.append("image", image);
    };

    //Api
    const create = async (): Promise<void> => {
        try {
            addFormData();
            await categoryService.createCategory(formData);
            dispatch(reloadFunc());
            setCategory(categoryInit);
        } catch (err) {
            console.log(err);
        }
    };

    const update = async (): Promise<void> => {
        try {
            addFormData();
            await categoryService.updateCategory(categoryDetail.id, formData);
            dispatch(reloadFunc());
        } catch (err) {
            console.log(err);
        }
    };

    //Handle when button create/update click
    const handleCreateCategory = (): void => {
        if (modalTitle === process.env.REACT_APP_CREATE_VALUE) {
            create();
        } else {
            update();
        }
    };

    //Set category detail
    useEffect(() => {
        if (categoryDetail?.id) {
            setCategory({
                id: categoryDetail.id,
                name: categoryDetail.name,
                image: categoryDetail.image,
            });
        }
    }, [categoryDetail]);

    return (
        <Modal headerTitle="Category">
            <div
                className={cx(
                    "d-flex flex-column justify-content-between",
                    "wrapper-content"
                )}
            >
                <form className={cx("form")} action="">
                    <div className={cx("form-item")}>
                        <InputForm
                            label="Name"
                            name="name"
                            onChange={(e) => handleInputChange(e)}
                            placeholder="Email"
                            type="text"
                            value={name || ""}
                        />
                    </div>

                    <UploadImage
                        onChange={(event) => handleUploadFile(event)}
                        image={image}
                    />
                </form>
                <button
                    type="button"
                    className={cx("btn btn-outline-primary", "btn-add")}
                    onClick={handleCreateCategory}
                >
                    {modalTitle}
                </button>
            </div>
        </Modal>
    );
}

export default CategoryModal;
