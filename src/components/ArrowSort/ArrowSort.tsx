import classNames from "classnames/bind";
import styles from "./ArrowSort.module.scss";

interface Sort {
    onClick: (orderBy: string) => void;
}

const cx = classNames.bind(styles);
function ArrowSort({ onClick }: Sort) {
    return (
        <div className={cx("sort")}>
            <div
                className={cx("arrow-up")}
                onClick={() => onClick("DESC")}
            ></div>
            <div
                className={cx("arrow-down")}
                onClick={() => onClick("ASC")}
            ></div>
        </div>
    );
}

export default ArrowSort;
