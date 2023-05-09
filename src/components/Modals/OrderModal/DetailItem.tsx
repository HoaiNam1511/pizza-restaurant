import styles from "./OrderModal.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function DetailItem({
    title,
    value,
}: {
    title: string;
    value: number | string;
}) {
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
