import classNames from "classnames/bind";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";

import * as selectorState from "../../../redux/selector";

import styles from "./Modal.module.scss";
import Loading from "../../Loading/Loading";

import { closeModal } from "../../../redux/slice/globalSlice";

const cx = classNames.bind(styles);

interface modalPropsType {
    children?: React.ReactNode;
    className?: string;
    headerTitle: string;
    modalCrud?: boolean;
    onClick?: () => void;
}
function Modal({
    children,
    className,
    headerTitle = "Create",
    modalCrud = false,
    onClick,
}: modalPropsType) {
    const dispatch = useDispatch();
    const modalStatus = useSelector(selectorState.selectStatusModal);
    const modalTitle = useSelector(selectorState.selectModalTitleStatus);
    const selectLoading = useSelector(selectorState.selectLoading);

    const actionOnClick = (): void => {
        if (onClick) {
            if (!selectLoading) {
                onClick();
            }
        }
    };

    return (
        <div
            className={cx("d-flex justify-content-center align-items-center", {
                overlay: modalStatus,
            })}
        >
            <div
                className={cx(className, "modal-wrapper", {
                    "modal-open": modalStatus,
                })}
            >
                <div
                    className={cx(
                        "d-flex justify-content-between align-items-center",
                        "modal-header"
                    )}
                >
                    <h3
                        className={cx("header-title")}
                    >{`${modalTitle} ${headerTitle}`}</h3>
                    <button
                        disabled={selectLoading}
                        className={cx("header_btn")}
                        onClick={() => dispatch(closeModal())}
                    >
                        <CloseIcon className={cx("header-btn_icon")} />
                    </button>
                </div>
                <div className={cx("modal-content")}>{children}</div>
                <div className={cx("modal-footer")}></div>
                <footer className={cx("footer")}>
                    {modalCrud && (
                        <button
                            type="button"
                            className={cx(
                                "btn btn-outline-primary",
                                "btn-action"
                            )}
                            onClick={actionOnClick}
                        >
                            <span className={cx("btn-title")}>
                                {modalTitle}
                                {selectLoading && (
                                    <Loading className={cx("modal-loading")} />
                                )}
                            </span>
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
}

export default Modal;
