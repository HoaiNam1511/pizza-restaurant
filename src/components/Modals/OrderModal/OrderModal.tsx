import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import Modal from "../Modal/Modal";
import { useState, useEffect } from "react";
import styles from "./OrderModal.module.scss";
import { selectOrderDetail } from "../../../redux/selector";
import DetailItem from "./DetailItem";
import * as globalInterface from "../../../types";
import { convertToUSD } from "../../../custom";
import moment from "moment";

const cx = classNames.bind(styles);
export interface Detail {
    title: string;
    value: string | number;
}

function OrderModal() {
    const orderDetail = useSelector(selectOrderDetail);
    const [product, setProduct] = useState<any | null>([]);
    const [total, setTotal] = useState<number | null>(null);

    const productDetailList: globalInterface.TitleValueString[] = [
        { title: "Name", value: "" },
        { title: "Price", value: "" },
        { title: "Material", value: "" },
        { title: "Description", value: "" },
    ];

    //Set product when click to table
    const handleProductOnClick = (productArgument: any) => {
        const valuesArray = Object.values(productArgument);
        const newArr = productDetailList.map((item, index) => {
            if (index < 5) {
                return {
                    title: item.title,
                    value: valuesArray[index],
                };
            }
        });
        setProduct(newArr);
    };

    //Handle total order
    const handleTotalOrder = () => {
        const sum = orderDetail?.products.reduce(
            (acc, cur) => acc + cur.price * cur.order_details.quantity,
            0
        );
        if (sum !== undefined) {
            setTotal(sum);
        }
    };

    useEffect(() => {
        handleTotalOrder();
    }, [orderDetail]);

    return (
        <Modal headerTitle="Order Detail">
            <div className={cx("row g-0", "wrapper-content")}>
                <div className={cx("col-7", "left")}>
                    <div className={cx("left-1")}>
                        <table className={cx("table")}>
                            <thead>
                                <tr className={cx("row g-0")}>
                                    <th className={cx("col-5")}>
                                        Item Summary
                                    </th>
                                    <th className={cx("col-2")}>Quantity</th>
                                    <th className={cx("col-2")}>Price</th>
                                    <th className={cx("col-3")}>Total price</th>
                                </tr>
                            </thead>
                            {orderDetail !== null &&
                                orderDetail.products?.map((product, index) => (
                                    <tbody key={index}>
                                        <tr
                                            className={cx("row g-0")}
                                            onClick={() =>
                                                handleProductOnClick(product)
                                            }
                                        >
                                            <td className={cx("col-5")}>
                                                <img
                                                    className={cx("image")}
                                                    src={`${process.env.REACT_APP_SERVER_URL}/images/${product.image}`}
                                                    alt=""
                                                />
                                                {product.name}
                                            </td>
                                            <td className={cx("col-2")}>
                                                {product.order_details.quantity}
                                            </td>
                                            <td className={cx("col-2")}>
                                                {convertToUSD(product.price)}
                                            </td>
                                            <td className={cx("col-3")}>
                                                {convertToUSD(
                                                    product.price *
                                                        product.order_details
                                                            .quantity
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                ))}
                        </table>
                    </div>
                    <div className={cx("left-2")}>
                        <table className={cx("table")}>
                            <thead>
                                <tr className={cx("row g-0")}>
                                    <th className={cx("col-6")}>
                                        Product Detail
                                    </th>
                                    <th className={cx("col-6")} />
                                </tr>
                            </thead>
                            <tbody>
                                {product.length > 0
                                    ? product
                                          .slice(0, product.length - 1)
                                          .map(
                                              (
                                                  productDetail: Detail,
                                                  index: number
                                              ) => (
                                                  <tr
                                                      className={cx("row g-0")}
                                                      key={index}
                                                  >
                                                      <td
                                                          className={cx(
                                                              "col-6"
                                                          )}
                                                      >
                                                          {productDetail.title}
                                                      </td>
                                                      <td
                                                          className={cx(
                                                              "col-6"
                                                          )}
                                                      >
                                                          {productDetail.value}
                                                      </td>
                                                  </tr>
                                              )
                                          )
                                    : productDetailList
                                          .slice(0, product.length - 1)
                                          .map((productDetail, index) => (
                                              <tr
                                                  className={cx("row g-0")}
                                                  key={index}
                                              >
                                                  <td className={cx("col-6")}>
                                                      {productDetail.title}
                                                  </td>
                                                  <td className={cx("col-6")}>
                                                      {product !== null
                                                          ? product.value
                                                          : ""}
                                                  </td>
                                              </tr>
                                          ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={cx("col-5", "right")}>
                    <div className={cx("right-1")}>
                        <h2 className={cx("title-header")}>Order Detail</h2>
                        {orderDetail !== null && (
                            <>
                                <DetailItem
                                    title="Order Code"
                                    value={orderDetail.order_code.toUpperCase()}
                                />
                                <DetailItem
                                    title="Order Created"
                                    value={moment(
                                        orderDetail.order_date,
                                        "YYYY-MM-DD"
                                    ).format("DD/MM/YYYY")}
                                />
                                <DetailItem
                                    title="Order Status"
                                    value={orderDetail.order_status}
                                />
                                <DetailItem
                                    title="Payment Method"
                                    value={orderDetail.payment_method}
                                />
                                <DetailItem
                                    title="Payment Status"
                                    value={orderDetail.payment_status}
                                />
                                <DetailItem
                                    title="Total"
                                    value={
                                        total !== null ? convertToUSD(total) : 0
                                    }
                                />
                            </>
                        )}
                    </div>
                    <div className={cx("right-2")}>
                        <h2 className={cx("title-header")}>
                            Customer Information
                        </h2>
                        {orderDetail !== null && (
                            <>
                                <DetailItem
                                    title="Customer name"
                                    value={orderDetail.customer.name}
                                />
                                <DetailItem
                                    title="Email"
                                    value={orderDetail.customer.email}
                                />
                                <DetailItem
                                    title="Phone number"
                                    value={orderDetail.customer.phone_number}
                                />
                                <DetailItem
                                    title="Address"
                                    value={orderDetail.customer.address}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default OrderModal;
