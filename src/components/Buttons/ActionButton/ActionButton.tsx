import classNames from "classnames/bind";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import styles from "./ActionButton.module.scss";

const cx = classNames.bind(styles);
interface ActionButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    type: string;
}

function ActionButton({
    onClick,
    className,
    type = "update",
}: ActionButtonProps) {
    return (
        <button className={cx("action-button_wrapper", type)} onClick={onClick}>
            {type === "update" && (
                <EditIcon className={cx("icon-update")}></EditIcon>
            )}
            {type === "delete" && (
                <DeleteIcon className={cx("icon-delete")}></DeleteIcon>
            )}
            {type === "detail" && (
                <VisibilityOutlinedIcon
                    className={cx("icon-detail")}
                ></VisibilityOutlinedIcon>
            )}
        </button>
    );
}

export default ActionButton;
