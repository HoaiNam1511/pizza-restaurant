import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";

import styles from "./CategoryModal.module.scss";
import Modal from "../Modal/Modal";
import UploadImage from "../../UploadImage/UploadImage";
import InputForm from "../../InputForm/InputForm";

import * as categoryService from "../../../services/categoryService";
import * as selectorState from "../../../redux/selector";
import * as globalInterface from "../../../types";
import * as globalAction from "../../../redux/slice/globalSlice";

import { reloadFunc, setToast } from "../../../redux/slice/globalSlice";
import { categoryInit } from "../../../pages/Category/Category";
import { axiosCreateJWT } from "../../../util/jwtRequest";
import { loginSuccess } from "../../../redux/slice/authSlice";

const cx = classNames.bind(styles);

function CategoryModal() {
    let formData: any = new FormData();
    const dispatch = useDispatch();
    const [category, setCategory] =
        useState<globalInterface.Category<File | string | null>>(categoryInit);
    const { id, name, image } = category;

    const categoryDetail: globalInterface.Category<string | null> = useSelector(
        selectorState.selectCategoryDetail
    );
    const modalTitle: string = useSelector(
        selectorState.selectModalTitleStatus
    );
    const currentAccount: globalInterface.CurrentAccount | null = useSelector(
        selectorState.selectCurrentAccount
    );

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

    //Api: create category
    const create = async (): Promise<void> => {
        try {
            addFormData();

            dispatch(globalAction.setLoadingRequest());
            const res = await categoryService.createCategory(
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
                {
                    category: formData,
                }
            );
            dispatch(reloadFunc());
            dispatch(setToast(res));
            setCategory(categoryInit);
            dispatch(globalAction.setLoadingResponse());
        } catch (err) {
            console.log(err);
        }
    };

    //Api: update category
    const update = async (): Promise<void> => {
        try {
            addFormData();
            dispatch(globalAction.setLoadingRequest());
            const res = await categoryService.updateCategory(
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
                {
                    category: formData,
                    id: categoryDetail.id || 0,
                }
            );
            dispatch(reloadFunc());
            dispatch(setToast(res));
            dispatch(globalAction.setLoadingResponse());
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
        <Modal
            headerTitle="Category"
            modalCrud={true}
            onClick={handleCreateCategory}
        >
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
            </div>
        </Modal>
    );
}

export default CategoryModal;
