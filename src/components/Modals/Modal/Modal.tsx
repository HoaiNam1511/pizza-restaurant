import styles from "./Modal.module.scss";
import classNames from "classnames/bind";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
    selectStatusModal,
    selectModalTitleStatus,
} from "../../../redux/selector";
import { closeModal } from "../../../redux/slice/globalSlice";

const cx = classNames.bind(styles);

interface modalPropsType {
    children?: React.ReactNode;
    className?: string;
    headerTitle: string;
}
function Modal({
    children,
    className,
    headerTitle = "Create",
}: modalPropsType) {
    const dispatch = useDispatch();
    const modalStatus = useSelector(selectStatusModal);
    const modalTitle = useSelector(selectModalTitleStatus);
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
                        className={cx("header_btn")}
                        onClick={() => dispatch(closeModal())}
                    >
                        <CloseIcon className={cx("header-btn_icon")} />
                    </button>
                </div>
                <div className={cx("modal-content")}>{children}</div>
            </div>
        </div>
    );
}

export default Modal;
