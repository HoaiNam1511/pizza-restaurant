import classNames from "classnames/bind";
import styles from "./Loading.module.scss";

const cx = classNames.bind(styles);

interface LoadingProps {
    className?: string;
    size?: string;
}

function Loading({ className, size = "small" }: LoadingProps) {
    return <span className={cx("loading", className, size)}></span>;
}
export default Loading;
