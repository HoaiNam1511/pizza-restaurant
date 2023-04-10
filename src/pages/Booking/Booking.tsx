import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Booking.module.scss";
import ArrowSort from "../../components/ArrowSort/ArrowSort";
import SelectAction from "../../components/SelectAction/SelectAction";
import BookingModal from "../../components/Modals/BookingModal/BookingModal";
import * as bookingService from "../../services/bookingService";

import {
    modalCreate,
    openModal,
    modalUpdate,
    reloadFunc,
    addPageCount,
} from "../../redux/slice/globalSlice";
import { setBookingDetail, BookingData } from "../../redux/slice/bookingSlice";
import { ActionButton } from "../../components/Buttons";
import { bookingStatusData } from "../../data/index";
import { selectReload, selectCurrentPage } from "../../redux/selector";
import { columnTable } from "../../data/index";
import { Sort } from "../../types/";
import { Table } from "../Table/Table";

const cx = classNames.bind(styles);

export interface Booking {
    id?: number;
    customerName: string;
    customerEmail: string;
    customerPhone: number;
    bookingDate: any;
    bookingTime: any;
    partySize: number;
    bookingStatus: string;
    note: string;
    tableId: number;
}

export interface BookingApi {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: number;
    booking_date: any;
    booking_time: any;
    booking_status: string;
    party_size: number;
    note: string;
    table_id: number;
    table: Table;
}

function Booking() {
    const dispatch = useDispatch();
    const [listBooking, setListBooking] = useState<[]>([]);
    const [booking, setBooking] = useState<Booking | null>(null);
    const pageChange = useSelector(selectCurrentPage);
    const reload = useSelector(selectReload);

    //Handle create booking
    const handleCreateBooking = (): void => {
        dispatch(modalCreate());
        dispatch(openModal());
    };

    //Api
    const getBooking = async ({ orderBy = "DESC", sortBy = "id" }) => {
        try {
            const res = await bookingService.get({
                page: pageChange,
                orderBy,
                sortBy,
            });
            setListBooking(res.data);
            dispatch(addPageCount(res.totalPage));
        } catch (err) {
            console.log(err);
        }
    };

    const sortBooking = async ({ orderBy, sortBy }: Sort) => {
        getBooking({ orderBy, sortBy });
    };

    const handleSelectChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
        booking: BookingApi
    ) => {
        setBooking({
            id: booking.id,
            customerName: booking.customer_name,
            customerEmail: booking.customer_email,
            customerPhone: booking.customer_phone,
            bookingDate: booking.booking_date,
            bookingTime: booking.booking_time,
            partySize: booking.party_size,
            bookingStatus: event.target.value,
            note: booking.note,
            tableId: booking.table_id,
        });
    };

    const updateBooking = async (): Promise<void> => {
        try {
            if (booking && booking.id !== undefined) {
                await bookingService.update(booking, booking.id);
                dispatch(reloadFunc());
                getBooking({});
            }
        } catch (err) {
            console.log(err);
        }
    };

    //Handle update
    const handleUpdateBooking = (booking: BookingData) => {
        dispatch(setBookingDetail(booking));
        dispatch(modalUpdate());
        dispatch(openModal());
    };

    useEffect(() => {
        getBooking({});
    }, [reload, pageChange]);

    useEffect(() => {
        updateBooking();
    }, [booking]);

    return (
        <div className={cx("row g-0", "wrapper")}>
            <BookingModal />
            <div className={cx("booking")}>
                <div
                    className={cx(
                        "d-flex justify-content-between",
                        "booking-header"
                    )}
                >
                    <h2 className={cx("booking-header_title")}>
                        Table booking
                    </h2>
                    <div>
                        <button
                            onClick={handleCreateBooking}
                            type="button"
                            className={cx(
                                "btn btn-outline-primary",
                                "booking-header_btn--outline"
                            )}
                        >
                            Add
                        </button>
                    </div>
                </div>
                <section className={cx("table-container")}>
                    <table className={cx("table")}>
                        <thead>
                            <tr className={cx("row g-0")}>
                                <th className={cx("col-1")}>#</th>
                                <th className={cx("col-2")}>Name</th>
                                <th className={cx("col-2")}>Phone</th>
                                <th className={cx("col-2")}>Table</th>
                                <th className={cx("col-1")}>
                                    Date
                                    <ArrowSort
                                        onClick={(orderBy) =>
                                            sortBooking({
                                                orderBy,
                                                sortBy: columnTable.bookingTime,
                                            })
                                        }
                                    />
                                </th>
                                <th className={cx("col-1")}>
                                    Time
                                    <ArrowSort
                                        onClick={(orderBy) =>
                                            sortBooking({
                                                orderBy,
                                                sortBy: columnTable.bookingTime,
                                            })
                                        }
                                    />
                                </th>
                                <th className={cx("col-2")}>Status</th>
                                <th className={cx("col-1")}>Action</th>
                            </tr>
                        </thead>
                        {listBooking?.map((booking: any, index) => (
                            <tbody key={index}>
                                <tr className={cx("row g-0")}>
                                    <th scope="row" className={cx("col-1")}>
                                        {index}
                                    </th>

                                    <td className={cx("col-2")}>
                                        {booking?.customer_name}
                                    </td>
                                    <td className={cx("col-2")}>
                                        {booking?.customer_phone}
                                    </td>
                                    <td className={cx("col-2")}>
                                        {booking?.table.table_title}
                                    </td>
                                    <td className={cx("col-1")}>
                                        {booking?.booking_date}
                                    </td>
                                    <td className={cx("col-1")}>
                                        {booking?.booking_time}
                                    </td>
                                    <td className={cx("col-2")}>
                                        <SelectAction
                                            data={bookingStatusData}
                                            name="bookingStatus"
                                            onChange={(e) =>
                                                handleSelectChange(e, booking)
                                            }
                                            currentStatus={
                                                booking.booking_status
                                            }
                                            type={booking.booking_status}
                                        />
                                    </td>
                                    <td className={cx("col-1")}>
                                        <ActionButton
                                            onClick={() =>
                                                handleUpdateBooking(booking)
                                            }
                                            type="update"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </section>
            </div>
        </div>
    );
}

export default Booking;
