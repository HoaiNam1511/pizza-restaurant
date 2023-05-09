import classNames from "classnames/bind";
import { useSelector, useDispatch } from "react-redux";

import styles from "./MainLayout.module.scss";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Paginate from "../../components/Paginate/Paginate";

import * as selectorState from "../../redux/selector";

import { addPage } from "../../redux/slice/globalSlice";

type ChildrenProps = {
    children: React.ReactNode;
};

const cx = classNames.bind(styles);
function MainLayout({ children }: ChildrenProps) {
    const dispatch = useDispatch();
    const pageCount = useSelector(selectorState.selectPageCount);

    return (
        <div className={cx("container-fluid gx-0", "wrapper")}>
            <div className={cx("row g-0")}>
                <Sidebar className={cx("left-content", "col-2")}></Sidebar>
                <div
                    className={cx(
                        "right-content",
                        "col-10 d-flex flex-column align-items-center justify-content-between"
                    )}
                >
                    <div
                        className={cx(
                            "right-content",
                            "col-12 d-flex flex-column align-items-center"
                        )}
                    >
                        <Navbar className={cx("right-content_nav")} />
                        <div className={cx("col-12", "right-content_child")}>
                            {children}
                        </div>
                    </div>
                    {pageCount !== 0 && (
                        <Paginate
                            pageCount={pageCount}
                            onClick={(page) => dispatch(addPage(page))}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default MainLayout;
