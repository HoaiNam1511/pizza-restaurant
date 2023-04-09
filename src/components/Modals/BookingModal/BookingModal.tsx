import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";

import * as bookingService from "../../../services/bookingService";

import Modal from "../Modal/Modal";
import styles from "./BookingModal.module.scss";
import InputForm from "../../InputForm/InputForm";

import { bookingStatusData } from "../../../data/index";
import { reloadFunc } from "../../../redux/slice/globalSlice";
import {
    selectModalTitleStatus,
    selectBookingDetail,
} from "../../../redux/selector";
import { Booking } from "../../../pages/Booking/Booking";
import { partySizeData, PartySizeData } from "../../../data/index";

const bookingInit = {
    customerName: "",
    customerEmail: "",
    customerPhone: 0,
    bookingDate: new Date(),
    bookingTime: new Date(),
    partySize: 0,
    bookingStatus: "",
    note: "",
    tableId: 0,
};

export interface Table {
    id: number;
    table_title: string;
    table_size: string;
    table_used: string;
}

const cx = classNames.bind(styles);
function BookingModal() {
    const dispatch = useDispatch();
    const [booking, setBooking] = useState<Booking>(bookingInit);
    const [tables, setTable] = useState<Table[]>([]);
    const [quantityTable, setQuantityTable] = useState<PartySizeData[]>([]);
    const [tableFilter, setTableFilter] = useState<Table[]>([]);
    const modalTitle = useSelector(selectModalTitleStatus);
    const bookingDetail = useSelector(selectBookingDetail);

    const {
        customerName,
        customerEmail,
        customerPhone,
        bookingDate,
        bookingTime,
        partySize,
        bookingStatus,
        tableId,
    } = booking;

    //Handle when input change
    const handleBookingChange = (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setBooking({ ...booking, [event.target.name]: event.target.value });
    };

    const getTable = async () => {
        try {
            const response = await bookingService.getTable();
            setTable(response);
        } catch (err) {
            console.log(err);
        }
    };

    //Create booking
    const create = async (): Promise<void> => {
        try {
            await bookingService.create(booking);
            dispatch(reloadFunc());
            setBooking(bookingInit);
            getTable();
        } catch (err) {
            console.log(err);
        }
    };

    const update = async (): Promise<void> => {
        try {
            await bookingService.update(booking, bookingDetail.id);
            dispatch(reloadFunc());
            getTable();
        } catch (err) {
            console.log(err);
        }
    };

    //Handle when button click
    const handleCreateBooking = (): void => {
        if (modalTitle === process.env.REACT_APP_CREATE_VALUE) {
            create();
        } else {
            update();
        }
    };

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

    const handlePartySizeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const filterTable: Table[] = tables.filter(
            (table) => table.table_size >= event.target.value
        );

        setTableFilter(filterTable);
        setBooking({
            ...booking,
            [event.target.name]: event.target.value,
            tableId: filterTable[0].id,
        });
    };

    useEffect(() => {
        getTable();
    }, []);

    useEffect(() => {
        updateQuantityTable();
    }, [tables]);

    useEffect(() => {
        if (bookingDetail !== null) {
            setBooking({
                customerName: bookingDetail.customer_name,
                customerEmail: bookingDetail.customer_email,
                customerPhone: bookingDetail.customer_phone,
                bookingDate: bookingDetail.booking_date,
                bookingTime: bookingDetail.booking_time,
                partySize: bookingDetail.party_size,
                bookingStatus: bookingDetail.booking_status,
                note: "",
                tableId: bookingDetail.table_id,
            });
        }
    }, [bookingDetail]);

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
                            onChange={(e) => handleBookingChange(e)}
                            placeholder="Name"
                            type="text"
                            value={customerName}
                        />
                    </div>
                    <div className={cx("form-item")}>
                        <InputForm
                            label="Email"
                            name="customerEmail"
                            onChange={(e) => handleBookingChange(e)}
                            placeholder="Email"
                            type="text"
                            value={customerEmail}
                        />
                    </div>
                    <div className={cx("d-flex", "form-flex")}>
                        <div className={cx("form-item", "item-2")}>
                            <InputForm
                                label="Phone"
                                name="customerPhone"
                                onChange={(e) => handleBookingChange(e)}
                                placeholder="Phone"
                                type="text"
                                value={customerPhone}
                            />
                        </div>
                        <div className={cx("form-item")}>
                            <label className={cx("label")} htmlFor="">
                                Status
                            </label>
                            <select
                                className={cx("input")}
                                name="bookingStatus"
                                onChange={(e) => handleBookingChange(e)}
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
                                name="bookingDate"
                                onChange={(e) => handleBookingChange(e)}
                                placeholder=""
                                type="date"
                                value={bookingDate}
                            />
                        </div>
                        <div className={cx("form-item")}>
                            <InputForm
                                label="Time"
                                name="bookingTime"
                                onChange={(e) => handleBookingChange(e)}
                                placeholder=""
                                type="time"
                                value={bookingTime}
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
                                    <option value={item.value} key={index}>
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
                                onChange={(e) => handleBookingChange(e)}
                                value={tableId}
                            >
                                {tableFilter.length
                                    ? tableFilter.map((table, index) => (
                                          <option value={table.id} key={index}>
                                              {`${table.table_title} - ${table.table_size} people`}
                                          </option>
                                      ))
                                    : tables.map((table, index) => (
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
