import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";

import * as bookingService from "../../../services/bookingService";

import Modal from "../Modal/Modal";
import styles from "./BookingModal.module.scss";
import InputForm from "../../InputForm/InputForm";

import { bookingStatusData } from "../../../data/index";
import { reloadFunc, setToast } from "../../../redux/slice/globalSlice";
import {
    selectModalTitleStatus,
    selectBookingDetail,
    selectCurrentAccount,
} from "../../../redux/selector";
import { partySizeData } from "../../../data/index";
import * as globalInterface from "../../../types";
import { axiosCreateJWT } from "../../../util/jwtRequest";
import { loginSuccess } from "../../../redux/slice/authSlice";

const bookingInit = {
    customerName: "",
    email: "",
    phone: 0,
    date: new Date(),
    time: new Date(),
    partySize: 1,
    bookingStatus: bookingStatusData[0].value,
    note: "",
    tableId: 0,
};

const cx = classNames.bind(styles);
function BookingModal() {
    const refSelect = useRef<any>(null);
    const dispatch = useDispatch();

    const [booking, setBooking] =
        useState<globalInterface.Booking>(bookingInit);
    const [tables, setTable] = useState<globalInterface.Table[]>([]);
    const [quantityTable, setQuantityTable] = useState<
        globalInterface.PartySizeData[]
    >([]);
    const [tableFilter, setTableFilter] = useState<globalInterface.Table[]>([]);

    const modalTitle = useSelector(selectModalTitleStatus);
    const bookingDetail = useSelector(selectBookingDetail);
    const currentAccount = useSelector(selectCurrentAccount);

    const {
        customerName,
        email,
        phone,
        date,
        time,
        partySize,
        bookingStatus,
        tableId,
    } = booking;

    //Handle event change
    const handleEventChange = (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setBooking({ ...booking, [event.target.name]: event.target.value });
    };

    //Create booking
    const create = async (): Promise<void> => {
        try {
            const res = await bookingService.create(booking);
            dispatch(reloadFunc());
            dispatch(setToast(res));
            setBooking(bookingInit);
            getTable();
        } catch (err) {
            console.log(err);
        }
    };

    //Update booking
    const update = async (): Promise<void> => {
        try {
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
                    id: bookingDetail.id,
                }
            );
            dispatch(reloadFunc());
            dispatch(setToast(res));
            getTable();
        } catch (err) {
            console.log(err);
        }
    };

    //Get table available
    const getTable = async () => {
        try {
            const response = await bookingService.getTable(
                {
                    headers: { token: currentAccount?.token },
                    axiosJWT: axiosCreateJWT(
                        currentAccount,
                        dispatch,
                        loginSuccess
                    ),
                },
                { used: false }
            );
            setTable(response);
            setBooking({
                ...booking,
                partySize: response[0].table_size,
                tableId: response[0].id,
            });
        } catch (err) {
            console.log(err);
        }
    };

    //Handle btn click create or update account
    const handleCreateBooking = (): void => {
        if (modalTitle === process.env.REACT_APP_CREATE_VALUE) {
            create();
        } else {
            update();
        }
    };

    //Handle data quantity table
    const updateQuantityTable = (): void => {
        let quantityObj: any = {};
        for (let i = 0; i < tables.length; i++) {
            let value = tables[i].table_size;
            if (quantityObj[value]) {
                quantityObj[value]++;
            } else {
                quantityObj[value] = 1;
            }
        }

        const result = partySizeData.map((item) => {
            if (Object.keys(quantityObj).includes(item.value.toString())) {
                return {
                    ...item,
                    quantity: quantityObj[item.value],
                };
            } else {
                return item;
            }
        });
        setQuantityTable(result);
    };

    const handleFilterTableAvailable = (size: number) => {
        const filterTable: globalInterface.Table[] = tables.filter(
            (table) =>
                Number(table.table_size) >= size ||
                Number(table.table_size) === 0
        );
        setTableFilter(filterTable);
        setBooking({
            ...booking,
            tableId: filterTable[0]?.id,
            partySize: bookingDetail.party_size,
        });
    };

    //Handle party size
    const handlePartySizeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedOption = event.target.selectedOptions[0];
        const quantity = Number(selectedOption.dataset.quantity);

        if (quantity) {
            handleFilterTableAvailable(Number(event.target.value));
            setBooking({
                ...booking,
                [event.target.name]: event.target.value,
            });
        } else {
            alert(`Table for party size is full`);
        }
    };

    //Set information when update
    useEffect(() => {
        if (bookingDetail !== null) {
            handleFilterTableAvailable(bookingDetail.party_size);
            setBooking({
                customerName: bookingDetail.customer_name,
                email: bookingDetail.customer_email,
                phone: bookingDetail.customer_phone,
                date: bookingDetail.booking_date,
                time: bookingDetail.booking_time,
                partySize: bookingDetail.party_size,
                bookingStatus: bookingDetail.booking_status,
                note: "",
                tableId: bookingDetail.table_id,
            });
        }
    }, [bookingDetail]);

    useEffect(() => {
        updateQuantityTable();
    }, [tables]);

    useEffect(() => {
        getTable();
    }, []);

    return (
        <Modal headerTitle="Booking ">
            <div
                className={cx(
                    "d-flex flex-column justify-content-between",
                    "wrapper-content"
                )}
            >
                <form className={cx("form")} action="">
                    <div className={cx("form-item")}>
                        <InputForm
                            label="Customer Name"
                            name="customerName"
                            onChange={(e) => handleEventChange(e)}
                            placeholder="Name"
                            type="text"
                            value={customerName}
                        />
                    </div>
                    <div className={cx("form-item")}>
                        <InputForm
                            label="Email"
                            name="email"
                            onChange={(e) => handleEventChange(e)}
                            placeholder="Email"
                            type="text"
                            value={email}
                        />
                    </div>
                    <div className={cx("d-flex", "form-flex")}>
                        <div className={cx("form-item", "item-2")}>
                            <InputForm
                                label="Phone"
                                name="phone"
                                onChange={(e) => handleEventChange(e)}
                                placeholder="Phone"
                                type="text"
                                value={phone}
                            />
                        </div>
                        <div className={cx("form-item")}>
                            <label className={cx("label")} htmlFor="">
                                Status
                            </label>
                            <select
                                className={cx("input")}
                                name="bookingStatus"
                                onChange={(e) => handleEventChange(e)}
                                value={bookingStatus}
                            >
                                {bookingStatusData.map((item, index) => (
                                    <option value={item.value} key={index}>
                                        {item.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={cx("d-flex", "form-flex")}>
                        <div className={cx("form-item", "item-2")}>
                            <InputForm
                                label="Date"
                                name="date"
                                onChange={(e) => handleEventChange(e)}
                                placeholder=""
                                type="date"
                                value={date}
                            />
                        </div>
                        <div className={cx("form-item")}>
                            <InputForm
                                label="Time"
                                name="time"
                                onChange={(e) => handleEventChange(e)}
                                placeholder=""
                                type="time"
                                value={time}
                            />
                        </div>
                    </div>
                    <div className={cx("d-flex", "form-flex")}>
                        <div className={cx("form-item", "item-2")}>
                            <label className={cx("label")} htmlFor="">
                                Party size
                            </label>
                            <select
                                className={cx("input")}
                                name="partySize"
                                onChange={(e) => handlePartySizeChange(e)}
                                value={partySize}
                            >
                                {quantityTable.map((item, index) => (
                                    <option
                                        ref={refSelect}
                                        value={item.value}
                                        key={index}
                                        data-quantity={item.quantity}
                                    >
                                        {`${item.title} - ${item.quantity} table`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={cx("form-item")}>
                            <label className={cx("label")} htmlFor="">
                                Table
                            </label>
                            <select
                                className={cx("input")}
                                name="tableId"
                                onChange={(e) => handleEventChange(e)}
                                value={tableId}
                            >
                                {tableFilter.map((table, index) => (
                                    <option value={table.id} key={index}>
                                        {`${table.table_title} - ${table.table_size} people`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
                <button
                    type="button"
                    className={cx("btn btn-outline-primary", "btn-add")}
                    onClick={handleCreateBooking}
                >
                    {modalTitle}
                </button>
            </div>
        </Modal>
    );
}

export default BookingModal;
