import styles from "./OrderModal.module.scss";
import classNames from "classnames/bind";
import { Detail } from "./OrderModal";

const cx = classNames.bind(styles);

function DetailItem({ title, value }: Detail) {
    return (
        <div className={cx("d-flex justify-content-between", "item")}>
            <p className={cx("item-title")}>{title}</p>
            <p
                className={cx("item-title", {
                    "is-email":
                        typeof value === "string"
                            ? value.includes("@gmail")
                            : false,
                })}
            >
                {value}
            </p>
        </div>
    );
}

export default DetailItem;
