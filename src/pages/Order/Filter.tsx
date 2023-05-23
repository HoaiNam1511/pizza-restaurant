import styles from "./Order.module.scss";
import classNames from "classnames/bind";
import { useState } from "react";
import * as globalInterface from "../../types";
import * as staticData from "../../data";

const cx = classNames.bind(styles);

interface FilterProps {
    onFilterClick: (value: globalInterface.OrderFilter) => void;
}

export function Filter({ onFilterClick }: FilterProps) {
    const [filterOrder, setFilterOrder] = useState<globalInterface.OrderFilter>(
        {
            orderStatus: "",
            paymentStatus: "",
        }
    );
    const { orderStatus, paymentStatus } = filterOrder;

    const handleFilterChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setFilterOrder({
            ...filterOrder,
            [event.target.name]: event.target.value,
        });
    };

    const handleFilterOrder = () => {
        onFilterClick(filterOrder);
    };

    return (
        <div className={cx("block-wrapper")}>
            <select
                name="orderStatus"
                onChange={(e) => handleFilterChange(e)}
                value={orderStatus}
                className={cx("select")}
            >
                <option value="">All</option>
                {staticData.orderStatusData?.map(
                    (item: globalInterface.OrderStatusData, index: number) => (
                        <option value={item.value} key={index}>
                            {item.title}
                        </option>
                    )
                )}
            </select>

            <select
                name="paymentStatus"
                onChange={(e) => handleFilterChange(e)}
                value={paymentStatus}
                className={cx("select")}
            >
                <option value="">All</option>
                {staticData.paymentStatusData?.map(
                    (item: globalInterface.OrderStatusData, index: number) => (
                        <option value={item.value} key={index}>
                            {item.title}
                        </option>
                    )
                )}
            </select>

            <button
                onClick={handleFilterOrder}
                type="button"
                className={cx(
                    "btn btn-outline-primary",
                    "content-header_btn--outline"
                )}
            >
                Filter
            </button>
        </div>
    );
}
