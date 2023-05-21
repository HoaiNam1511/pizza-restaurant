import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import moment from "moment";

import OrderModal from "../../components/Modals/OrderModal/OrderModal";
import ArrowSort from "../../components/ArrowSort/ArrowSort";
import styles from "./Order.module.scss";
import SelectAction from "../../components/SelectAction/SelectAction";
import Loading from "../../components/Loading/Loading";
import { Filter } from "./Filter";

import * as orderService from "../../services/orderService";
import * as globalInterface from "../../types";
import * as selectorState from "../../redux/selector";
import * as globalAction from "../../redux/slice/globalSlice";

import { orderStatusData, paymentStatusData, columnTable } from "../../data";
import { ActionButton } from "../../components/Buttons";
import { setOrderDetail } from "../../redux/slice/orderSlice";
import { axiosCreateJWT } from "../../util/jwtRequest";
import { loginSuccess } from "../../redux/slice/authSlice";
import { convertToUSD } from "../../custom";
const cx = classNames.bind(styles);

const selectName = {
    orderStatus: "orderStatus",
    paymentStatus: "paymentStatus",
};

export interface OrderUpdate {
    id: number | null;
    order: globalInterface.OrderStatus;
}
const paymentCrash = "crash";
function Order() {
    const dispatch = useDispatch();
    const pageChange: number = useSelector(selectorState.selectCurrentPage);
    const currentAccount: globalInterface.CurrentAccount | null = useSelector(
        selectorState.selectCurrentAccount
    );
    const [loading, setLoading] = useState<boolean>(false);
    const reload: boolean = useSelector(selectorState.selectReload);
    const [orders, setOrders] = useState<globalInterface.Order[]>([]);
    const [orderStatus, setOrderStatus] = useState<globalInterface.OrderStatus>(
        {
            id: null,
            paymentMethod: "",
            orderStatus: "",
            paymentStatus: "",
        }
    );

    //Api
    const getOrder = async (
        { orderBy = "DESC", sortBy = "id" }: globalInterface.Sort,
        { orderStatus = "", paymentStatus = "" }: globalInterface.OrderFilter
    ): Promise<void> => {
        setLoading(true);
        const response = await orderService.getAll({
            page: pageChange,
            sortBy,
            orderBy,
            orderStatus,
            paymentStatus,
            headers: {
                token: currentAccount?.token,
            },
            axiosJWT: axiosCreateJWT(currentAccount, dispatch, loginSuccess),
        });
        setLoading(false);
        setOrders(response.data);
        dispatch(globalAction.addPageCount(response.totalPage));
    };

    const updateOrderStatus = async (): Promise<void> => {
        if (orderStatus.orderStatus) {
            dispatch(globalAction.setLoadingRequestOverlay());
            const res = await orderService.updateOrder(
                {
                    axiosJWT: axiosCreateJWT(
                        currentAccount,
                        dispatch,
                        loginSuccess
                    ),
                    headers: {
                        token: currentAccount?.token,
                    },
                },
                {
                    id: orderStatus.id,
                    order: orderStatus,
                }
            );
            dispatch(globalAction.setLoadingResponseOverlay());
            dispatch(globalAction.reloadFunc());
            dispatch(globalAction.setToast(res));
        }
    };

    //Show detail order
    const handleDetailOrder = (order: globalInterface.Order): void => {
        dispatch(setOrderDetail(order));
        dispatch(globalAction.openModal());
    };

    //Handle change status
    const handleSelectChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
        paymentMethod: string,
        orderItem: globalInterface.Order
    ): void => {
        const objOrder = {
            id: orderItem.id,
            paymentMethod: paymentMethod,
            orderStatus: orderItem.order_status,
            paymentStatus: orderItem.payment_status,
        };

        if (paymentMethod !== paymentCrash) {
            setOrderStatus({
                ...objOrder,
                [event.target.name]: event.target.value,
            });
        } else if (
            paymentMethod === paymentCrash &&
            selectName.orderStatus === event.target.name
        ) {
            setOrderStatus({
                ...objOrder,
                [event.target.name]: event.target.value,
            });
        } else {
            alert("Payment status only change when shipped");
        }
    };

    //Handle sort
    const handleSort = ({ orderBy, sortBy }: globalInterface.Sort): void => {
        getOrder({ orderBy, sortBy }, {});
    };

    useEffect(() => {
        getOrder(
            {
                orderBy: "DESC",
                sortBy: "id",
            },
            {}
        );
    }, [pageChange, reload]);

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
                    <Filter
                        onFilterClick={(value) =>
                            getOrder(
                                {},
                                {
                                    orderStatus: value.orderStatus,
                                    paymentStatus: value.paymentStatus,
                                }
                            )
                        }
                    ></Filter>
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

                        {!loading && (
                            <tbody>
                                {orders?.map((order, index) => (
                                    <tr className={cx("row g-0")} key={index}>
                                        <th scope="row" className={cx("col-2")}>
                                            {order.order_code.toUpperCase()}
                                        </th>

                                        <td className={cx("col-2")}>
                                            {moment(
                                                order.order_date,
                                                "YYYY-MM-DD"
                                            ).format("DD/MM/YYYY")}
                                        </td>

                                        <td className={cx("col-1")}>
                                            {order.products.length}
                                        </td>
                                        <td className={cx("col-1")}>
                                            {convertToUSD(
                                                order.products.reduce(
                                                    (
                                                        acc: number,
                                                        curr: any
                                                    ) => {
                                                        return (
                                                            acc +
                                                            curr.price *
                                                                curr
                                                                    .order_details
                                                                    .quantity
                                                        );
                                                    },
                                                    0
                                                )
                                            )}
                                        </td>
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
                                                currentStatus={
                                                    order.order_status
                                                }
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
                                                currentStatus={
                                                    order.payment_status
                                                }
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
                                ))}
                            </tbody>
                        )}
                    </table>
                    {loading && (
                        <Loading
                            size="medium"
                            className={cx("content-loading")}
                        />
                    )}
                </section>
            </div>
        </div>
    );
}

export default Order;
