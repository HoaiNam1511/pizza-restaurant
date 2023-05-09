import React from "react";
import classNames from "classnames/bind";

import styles from "./Breadcrumb.module.scss";

const cx = classNames.bind(styles);
interface breadcrumbPropsType {
    children?: React.ReactNode;
}

function Breadcrumb({ children }: breadcrumbPropsType) {
    return (
        <div className={cx("row g-0", "breadcrumb")}>
            {/* <div className={cx("d-flex justify-content-between")}>
                <div>Tables / Basic Tables</div>
                <div>{children}</div>
            </div> */}
        </div>
    );
}

export default Breadcrumb;
