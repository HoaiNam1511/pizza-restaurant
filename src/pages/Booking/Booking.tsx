import { useState, useEffect } from "react";
import classNames from "classnames/bind";

import styles from "./Booking.module.scss";
import { useDispatch, useSelector } from "react-redux";

import SelectAction from "../../components/SelectAction/SelectAction";
import BookingModal from "../../components/Modals/BookingModal/BookingModal";
import * as bookingService from "../../services/bookingService";

import {
    modalCreate,
    openModal,
    modalUpdate,
} from "../../redux/slice/globalSlice";
import { setBookingDetail } from "../../redux/slice/bookingSlice";
import { ActionButton } from "../../components/Buttons";
import { bookingStatusData } from "../../data/index";
import { selectReload } from "../../redux/selector";
import { BookingData } from "../../redux/slice/bookingSlice";
const cx = classNames.bind(styles);

export interface Booking {
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

function Booking() {
    const dispatch = useDispatch();
    const [listBooking, setListBooking] = useState<[]>([]);
    const reload = useSelector(selectReload);

    //Handle create booking
    const handleCreateBooking = (): void => {
        dispatch(modalCreate());
        dispatch(openModal());
    };

    //Api
    const getBooking = async () => {
        try {
            const res = await bookingService.get({});
            setListBooking(res.data);
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
        getBooking();
    }, [reload]);

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
                    <button
                        onClick={handleCreateBooking}
                        type="button"
                        className={cx(
                            "btn btn-outline-primary",
                            "booking-header_btn"
                        )}
                    >
                        Add
                    </button>
                </div>
                <section className={cx("table-container")}>
                    <table className={cx("table")}>
                        <thead>
                            <tr className={cx("row g-0")}>
                                <th className={cx("col-1")}>#</th>
                                <th className={cx("col-2")}>Email</th>
                                <th className={cx("col-2")}>Name</th>
                                <th className={cx("col-2")}>Phone</th>
                                <th className={cx("col-1")}>Date</th>
                                <th className={cx("col-1")}>Time</th>
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
                                        {booking?.customer_email}
                                    </td>
                                    <td className={cx("col-2")}>
                                        {booking?.customer_name}
                                    </td>
                                    <td className={cx("col-2")}>
                                        {booking?.customer_phone}
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
                                            onChange={() => console.log("")}
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
