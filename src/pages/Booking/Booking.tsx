import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import moment from "moment";

import styles from "./Booking.module.scss";
import ArrowSort from "../../components/ArrowSort/ArrowSort";
import SelectAction from "../../components/SelectAction/SelectAction";
import BookingModal from "../../components/Modals/BookingModal/BookingModal";

import * as bookingService from "../../services/bookingService";
import * as selectorState from "../../redux/selector";
import * as globalInterface from "../../types";

import {
    modalCreate,
    openModal,
    modalUpdate,
    reloadFunc,
    addPageCount,
    setToast,
} from "../../redux/slice/globalSlice";
import { setBookingDetail } from "../../redux/slice/bookingSlice";
import { ActionButton } from "../../components/Buttons";
import { bookingStatusData, columnTable } from "../../data/index";
import { axiosCreateJWT } from "../../util/jwtRequest";
import { loginSuccess } from "../../redux/slice/authSlice";

const cx = classNames.bind(styles);

function Booking() {
    const dispatch = useDispatch();

    const [listBooking, setListBooking] = useState<[]>([]);
    const [booking, setBooking] = useState<globalInterface.Booking | null>(
        null
    );
    const [filter, setFilter] = useState<string>("");
    const pageChange: number = useSelector(selectorState.selectCurrentPage);
    const reload: boolean = useSelector(selectorState.selectReload);
    const currentAccount: globalInterface.CurrentAccount | null = useSelector(
        selectorState.selectCurrentAccount
    );

    //Handle create booking
    const handleCreateBooking = (): void => {
        dispatch(modalCreate());
        dispatch(openModal());
    };

    //Api: get booking
    const getBooking = async ({
        orderBy = "DESC",
        sortBy = "id",
    }): Promise<void> => {
        try {
            const res = await bookingService.get({
                page: pageChange,
                orderBy,
                sortBy,
                status: filter,
                headers: {
                    token: currentAccount?.token,
                },
                axiosJWT: axiosCreateJWT(
                    currentAccount,
                    dispatch,
                    loginSuccess
                ),
            });
            setListBooking(res.data);
            dispatch(setToast(res));
            dispatch(addPageCount(res.totalPage));
        } catch (err) {
            console.log(err);
        }
    };

    const sortBooking = ({ orderBy, sortBy }: globalInterface.Sort): void => {
        getBooking({ orderBy, sortBy });
    };

    //Set
    const handleSelectChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
        booking: globalInterface.BookingData
    ): any => {
        const newBooking = {
            id: booking.id,
            customerName: booking.customer_name,
            email: booking.customer_email,
            phone: booking.customer_phone,
            date: booking.booking_date,
            time: booking.booking_time,
            partySize: booking.party_size,
            bookingStatus: event.target.value,
            note: booking.note,
            tableId: booking.table_id,
        };

        //If booking status not equal [done, cancel]
        if (!["done", "cancel"].includes(booking.booking_status)) {
            //If value change is [done, cancel]
            if (["done", "cancel"].includes(event.target.value)) {
                const answer = window.confirm(
                    `Are you sure? booking will be disable when status is ${event.target.value}`
                );
                //Notification
                if (answer) {
                    setBooking(newBooking);
                }
            } else {
                setBooking(newBooking);
            }
        }
    };

    //Api: update booking
    const updateBooking = async (): Promise<void> => {
        try {
            if (booking && booking.id !== undefined) {
                const res = await bookingService.update(
                    {
                        headers: {
                            token: currentAccount?.token,
                        },
                        axiosJWT: axiosCreateJWT(
                            currentAccount,
                            dispatch,
                            loginSuccess
                        ),
                    },
                    {
                        booking: booking,
                        id: booking.id,
                    }
                );
                dispatch(reloadFunc());
                dispatch(setToast(res));
            }
        } catch (err) {
            console.log(err);
        }
    };

    //Handle update
    const handleUpdateBooking = (
        booking: globalInterface.BookingData
    ): void => {
        dispatch(setBookingDetail(booking));
        dispatch(modalUpdate());
        dispatch(openModal());
    };

    useEffect(() => {
        getBooking({});
    }, [reload, pageChange, filter]);

    useEffect(() => {
        updateBooking();
    }, [booking]);

    return (
        <div className={cx("row g-0", "wrapper")}>
            <BookingModal />
            <div className={cx("content")}>
                <div
                    className={cx(
                        "d-flex justify-content-between",
                        "content-header"
                    )}
                >
                    <h2 className={cx("content-header_title")}>
                        Table booking
                    </h2>
                    <div className={cx("right-block")}>
                        <select
                            id="select"
                            name="bookingStatus"
                            onChange={(e) => setFilter(e.target.value)}
                            value={filter}
                            className={cx("select")}
                        >
                            <option value="">All</option>
                            {bookingStatusData.map(
                                (
                                    item: globalInterface.OrderStatusData,
                                    index
                                ) => (
                                    <option value={item.value} key={index}>
                                        {item.title}
                                    </option>
                                )
                            )}
                        </select>

                        <button
                            onClick={handleCreateBooking}
                            type="button"
                            className={cx(
                                "btn btn-outline-primary",
                                "content-header_btn--outline"
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
                                                sortBy: columnTable.bookingDate,
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
                                        {moment(
                                            booking?.booking_date,
                                            "YYYY-MM-DD"
                                        ).format("DD/MM/YYYY")}
                                    </td>
                                    <td className={cx("col-1")}>
                                        {moment(
                                            booking?.booking_time,
                                            "HH:mm "
                                        ).format("hh:mm A")}
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
