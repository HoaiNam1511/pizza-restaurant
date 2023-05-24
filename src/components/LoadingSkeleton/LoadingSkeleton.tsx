import classNames from "classnames/bind";
import styles from "./LoadingSkeleton.module.scss";

const cx = classNames.bind(styles);

interface LoadingSkeletonProps {
    className?: string;
}

function LoadingSkeleton({ className }: LoadingSkeletonProps) {
    return <div className={cx("loading-skeleton", className)}></div>;
}
export default LoadingSkeleton;
