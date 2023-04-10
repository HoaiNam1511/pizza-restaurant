import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";

import OrderModal from "../../components/Modals/OrderModal/OrderModal";
import ArrowSort from "../../components/ArrowSort/ArrowSort";
import styles from "./Order.module.scss";
import * as orderService from "../../services/orderService";
import SelectAction from "../../components/SelectAction/SelectAction";

import { orderStatusData, paymentStatusData, columnTable } from "../../data";
import { ActionButton } from "../../components/Buttons";
import { selectCurrentPage } from "../../redux/selector";
import { setOrderDetail } from "../../redux/slice/orderSlice";
import { openModal, addPageCount } from "../../redux/slice/globalSlice";
import { Sort } from "../../types";
const cx = classNames.bind(styles);
export interface Order {
    id: number;
    order_code: string;
    customer_id: number;
    order_date: string;
    order_status: string;
    payment_method: string;
    payment_status: string;
    customer: {
        id: number;
        name: string;
        email: string;
        address: string;
        phone_number: number;
    };
    products: {
        id: number;
        name: string;
        price: number;
        material: string;
        description: string;
        image: string;
        order_details: {
            id: number;
            order_id: number;
            product_id: number;
            quantity: number;
        };
    }[];
}

export interface OrderStatus {
    id: number | null;
    paymentMethod: string;
    orderStatus: string;
    paymentStatus: string;
}

const selectName = {
    orderStatus: "orderStatus",
    paymentStatus: "paymentStatus",
};

function Order() {
    const dispatch = useDispatch();
    const pageChange = useSelector(selectCurrentPage);
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderStatus, setOrderStatus] = useState<OrderStatus>({
        id: null,
        paymentMethod: "",
        orderStatus: "",
        paymentStatus: "",
    });

    //Api
    const getOrder = async ({ orderBy = "DESC", sortBy = "id" }: Sort) => {
        const response = await orderService.getAll({
            page: pageChange,
            sortBy,
            orderBy,
        });
        setOrders(response.data);
        dispatch(addPageCount(response.totalPage));
    };

    const updateOrderStatus = async () => {
        await orderService.updateOrder({
            id: orderStatus.id,
            order: orderStatus,
        });
        getOrder({});
    };

    //Show detail order
    const handleDetailOrder = (order: Order) => {
        dispatch(setOrderDetail(order));
        dispatch(openModal());
    };

    //Handle change status
    const handleSelectChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
        paymentMethod: string,
        orderItem: Order
    ): void => {
        setOrderStatus({
            ...orderStatus,
            id: orderItem.id,
            paymentMethod: paymentMethod,
            orderStatus: orderItem.order_status,
            paymentStatus: orderItem.payment_status,
        });
        if (paymentMethod !== "crash") {
            setOrderStatus((pre) => ({
                ...pre,
                [event.target.name]: event.target.value,
            }));
        } else if (
            paymentMethod === "crash" &&
            selectName.orderStatus === event.target.name
        ) {
            setOrderStatus((pre) => ({
                ...pre,
                [event.target.name]: event.target.value,
            }));
        } else {
            alert("Payment status only change when shipped");
        }
    };

    //Handle sort
    const handleSort = ({ orderBy, sortBy }: Sort) => {
        getOrder({ orderBy, sortBy });
    };

    useEffect(() => {
        getOrder({
            orderBy: "DESC",
            sortBy: "id",
        });
    }, [pageChange]);

    useEffect(() => {
        updateOrderStatus();
    }, [orderStatus]);

    return (
        <div className={cx("row g-0", "wrapper")}>
            <OrderModal />
            <div className={cx("order")}>
                <div
                    className={cx(
                        "d-flex justify-content-between",
                        "order-header"
                    )}
                >
                    <h2 className={cx("order-header_title")}>Table order</h2>
                </div>
                <section className={cx("table-container")}>
                    <table className={cx("table")}>
                        <thead>
                            <tr className={cx("row g-0")}>
                                <th className={cx("col-2")}>Code</th>
                                <th className={cx("col-2")}>
                                    Date
                                    <ArrowSort
                                        onClick={(orderBy) =>
                                            handleSort({
                                                orderBy,
                                                sortBy: columnTable.orderDate,
                                            })
                                        }
                                    />
                                </th>
                                <th className={cx("col-1")}>Quantity</th>
                                <th className={cx("col-1")}>Total</th>
                                <th className={cx("col-2")}>Customer</th>
                                <th className={cx("col-2")}>Status</th>
                                <th className={cx("col-1")}>Payment</th>
                                <th className={cx("col-1")}>Action</th>
                            </tr>
                        </thead>
                        {orders?.map((order, index) => (
                            <tbody key={index}>
                                <tr className={cx("row g-0")}>
                                    <th scope="row" className={cx("col-2")}>
                                        {order.order_code}
                                    </th>

                                    <td className={cx("col-2")}>
                                        {order.order_date}
                                    </td>
                                    <td className={cx("col-1")}>
                                        {order.products.length}
                                    </td>
                                    <td className={cx("col-1")}>{100}</td>
                                    <td className={cx("col-2")}>
                                        {order.customer.email}
                                    </td>
                                    <td className={cx("col-2")}>
                                        <SelectAction
                                            name={selectName.orderStatus}
                                            onChange={(event) =>
                                                handleSelectChange(
                                                    event,
                                                    order.payment_method,
                                                    order
                                                )
                                            }
                                            data={orderStatusData}
                                            type={order.order_status}
                                            currentStatus={order.order_status}
                                        />
                                    </td>
                                    <td className={cx("col-1")}>
                                        <SelectAction
                                            name={selectName.paymentStatus}
                                            onChange={(event) =>
                                                handleSelectChange(
                                                    event,
                                                    order.payment_method,
                                                    order
                                                )
                                            }
                                            data={paymentStatusData}
                                            type={order.payment_status}
                                            currentStatus={order.payment_status}
                                        />
                                    </td>
                                    <td className={cx("col-1")}>
                                        <ActionButton
                                            onClick={() =>
                                                handleDetailOrder(order)
                                            }
                                            type="detail"
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

export default Order;
