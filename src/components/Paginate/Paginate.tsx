import ReactPaginate from "react-paginate";
import classNames from "classnames/bind";

import styles from "./Paginate.module.scss";
const cx = classNames.bind(styles);

interface PaginateProps {
    pageCount: number;
    onClick: (page: number) => void;
}

function Paginate({ pageCount, onClick }: PaginateProps) {
    //Handle change page
    const handlePageClick = (event: any): void => {
        onClick(event.selected + 1);
    };

    return (
        <div className={cx("wrapper")}>
            <ReactPaginate
                previousLabel={"<<"}
                nextLabel={">>"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={cx("pagination-btn")}
                previousLinkClassName={cx("previous-btn")}
                nextLinkClassName={cx("next-btn")}
                disabledClassName={cx("pagination--disabled")}
                activeClassName={cx("active")}
            />
        </div>
    );
}

export default Paginate;
