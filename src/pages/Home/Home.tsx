import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";

import HomeIcon from "@mui/icons-material/Home";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import TableBarOutlinedIcon from "@mui/icons-material/TableBarOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import * as globalInterface from "../../types";
import * as orderService from "../../services/orderService";
import * as bookingService from "../../services/bookingService";
import * as selectorState from "../../redux/selector";

import styles from "./Home.module.scss";
import Card from "../../components/Card/Card";
import LineChart from "../../components/LineChart/LineChart";
import BarChart from "../../components/BarChart/BarChart";
import { addPageCount } from "../../redux/slice/globalSlice";
import { axiosCreateJWT } from "../../util/jwtRequest";
import { loginSuccess } from "../../redux/slice/authSlice";
import { convertToUSD } from "../../custom";

const cx = classNames.bind(styles);
function Home() {
    const dispatch = useDispatch();
    //Order week for card
    const [orderWeek, setOrderWeek] = useState<globalInterface.OrderWeekResult>(
        {
            orderQuantity: 0,
            subTotal: 0,
            productSale: 0,
        }
    );
    const [tableData, setTableData] = useState<globalInterface.Table[]>();
    const [mostAvailableTable, setMostAvailableTable] = useState<number>(0);
    const currentAccount: globalInterface.CurrentAccount | null = useSelector(
        selectorState.selectCurrentAccount
    );

    //Api
    //Get order of week
    const getOrderOfWeek = async (): Promise<void> => {
        const res = await orderService.getOrderOfWeek({
            axiosJWT: axiosCreateJWT(currentAccount, dispatch, loginSuccess),
            headers: {
                token: currentAccount?.token,
            },
        });

        let productSale: number = 0;

        //Handle order subtotal and quantity product of order
        const subTotalOrder: number = res.reduce(
            (total: number, item: globalInterface.OrderWeek) => {
                const sumOrder = item.products.reduce(
                    (acc: number, curr: globalInterface.OrderWeekProduct) => {
                        productSale += curr.quantity;
                        return acc + curr.price * curr.quantity;
                    },
                    0
                );
                return total + sumOrder;
            },
            0
        );

        setOrderWeek({
            subTotal: subTotalOrder,
            orderQuantity: res.length,
            productSale: productSale,
        });
    };

    //Get quantity of table
    const getTable = async (): Promise<void> => {
        const res = await bookingService.getAllTable({
            axiosJWT: axiosCreateJWT(currentAccount, dispatch, loginSuccess),
            headers: {
                token: currentAccount?.token,
            },
        });
        setTableData(res);
        handleMostAvailable(res);
    };

    //Handle get most table available
    const handleMostAvailable = (tables: globalInterface.Table[]): void => {
        let maxValue: number = 0;
        const tableCounts: globalInterface.Table = tables?.reduce(
            (counts: any, table: globalInterface.Table) => {
                if (counts[table.table_size]) {
                    counts[table.table_size] += 1;
                } else {
                    counts[table.table_size] = 1;
                }
                return counts;
            },
            {}
        );

        for (const value of Object.values(tableCounts)) {
            const numericValue: number = Number(value);
            if (numericValue > maxValue) {
                maxValue = numericValue;
            }
        }
        setMostAvailableTable(maxValue);
    };

    useEffect(() => {
        getOrderOfWeek();
        getTable();
        dispatch(addPageCount(0));
    }, []);

    const cardData: globalInterface.CardData[] = [
        {
            mainTitle: convertToUSD(orderWeek.subTotal) || 0,
            titleHeader: "Order total",
            footerTitle: "Increase by 70%",
            Icon: AttachMoneyIcon,
            cardColor: "#140062",
        },
        {
            mainTitle: orderWeek.orderQuantity || 0,
            titleHeader: "Order quantity",
            footerTitle: "Increase by 56%",
            Icon: TrendingUpIcon,
            cardColor: "#9101b9",
        },
        {
            mainTitle: orderWeek.productSale || 0,
            titleHeader: "Product sale",
            footerTitle: "Increase by 23%",
            Icon: BookmarkBorderIcon,
            cardColor: "#00a293",
        },
        {
            mainTitle: `${
                tableData?.filter((table) => table.table_used === false)
                    .length || 0
            }/${tableData?.length || 0}`,
            titleHeader: "Table available",
            footerTitle: `Table size ${mostAvailableTable} is a most table available`,
            Icon: TableBarOutlinedIcon,
            cardColor: "#00beff",
        },
    ];

    return (
        <div className={cx("row g-0", "wrapper")}>
            <div className={cx("content")}>
                <section className={cx("section-1")}>
                    <div className={cx("header-container")}>
                        <div className={cx("background")}>
                            <HomeIcon></HomeIcon>
                        </div>
                        <h2>Dashboard</h2>
                    </div>
                </section>

                <section className={cx("section-2")}>
                    {cardData.map((card, index) => (
                        <Card
                            key={index}
                            Icon={card.Icon}
                            mainTitle={card.mainTitle}
                            titleHeader={card.titleHeader}
                            footerTitle={card.footerTitle}
                            cardColor={card.cardColor}
                        />
                    ))}
                </section>

                <section className={cx("section-3")}>
                    <BarChart></BarChart>
                    <LineChart></LineChart>
                </section>
            </div>
        </div>
    );
}

export default Home;
