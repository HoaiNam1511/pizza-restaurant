import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames/bind";

import styles from "./Table.module.scss";
import * as bookingServices from "../../services/bookingService";
import tableImage from "../../assets/image/wooden-dining-table-chairs-isolated-white-background-image-84995256.jpg";

import { addPageCount } from "../../redux/slice/globalSlice";
export interface Table {
    id: number;
    table_title: string;
    table_size: string;
    table_used: string;
}

const cx = classNames.bind(styles);
function Table() {
    const dispatch = useDispatch();
    const [tables, setTable] = useState<Table[]>([]);
    const [status, setStatus] = useState<boolean | null>(null);
    const getTable = async () => {
        try {
            let response;
            if (status === null) {
                response = await bookingServices.getAllTable();
            } else {
                response = await bookingServices.getTable({ used: status });
            }
            setTable(response);
        } catch (err) {
            console.log(err);
        }
    };

    const onselectionchange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === "all") {
            setStatus(null);
        } else if (event.target.value === "used") {
            setStatus(true);
        } else {
            setStatus(false);
        }
    };

    useEffect(() => {
        dispatch(addPageCount(0));
    }, []);

    useEffect(() => {
        getTable();
    }, [status]);

    return (
        <div className={cx("row g-0", "wrapper")}>
            <div className={cx("table")}>
                <div
                    className={cx(
                        "d-flex justify-content-between",
                        "table-header"
                    )}
                >
                    <h2 className={cx("table-header_title")}>List Table</h2>
                    <select
                        className={cx("select")}
                        onChange={(e) => onselectionchange(e)}
                    >
                        <option value="all">All</option>
                        <option value="used">Used</option>
                        <option value="available">Available</option>
                    </select>
                </div>
                <section className={cx("row gx-0")}>
                    {tables.map((table, index) => (
                        <div
                            className={cx(
                                "col-2 d-flex flex-column align-items-center",
                                "item"
                            )}
                            key={index}
                        >
                            <img src={tableImage} alt="" />
                            <h4
                                className={cx(
                                    table.table_used ? "used" : "available"
                                )}
                            >
                                {table.table_used ? "Used" : "Available"}
                            </h4>
                            <h3>{`${table.table_title}-${table.table_size} people`}</h3>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}

export default Table;
