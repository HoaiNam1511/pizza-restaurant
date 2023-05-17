import {
    Chart as ChartJS,
    BarController,
    BarElement,
    ChartData,
} from "chart.js";
import { useEffect, useRef } from "react";
import * as orderService from "../../services/orderService";
import * as bookingService from "../../services/bookingService";
import { useSelector, useDispatch } from "react-redux";
import * as selectorState from "../../redux/selector";
import { axiosCreateJWT } from "../../util/jwtRequest";
import { loginSuccess } from "../../redux/slice/authSlice";
import * as globalInterface from "../../types";
import { useState } from "react";
import moment from "moment";
import Chart from "chart.js/auto";
import { setOrderWeek, setReloadChart } from "../../redux/slice/orderSlice";

ChartJS.register(BarController, BarElement);

function LineChart() {
    const dispatch = useDispatch();
    const lineChartRef = useRef(null);
    const [chartScaleMax, setChartScaleMax] = useState<number>(0);
    const [chartOrderData, setCharOrderData] = useState<
        globalInterface.ChartData[]
    >([]);

    const [chartBookingData, setChartBookingData] = useState<
        globalInterface.ChartData[]
    >([]);
    const currentAccount = useSelector(selectorState.selectCurrentAccount);

    const handleTotalProductOrder = (
        data: globalInterface.OrderWeek[]
    ): globalInterface.ChartData[] => {
        const result = data.map((item: globalInterface.OrderWeek) => {
            return {
                date: item.date,
                quantity: item.products.reduce(
                    (acc: number, curr: globalInterface.OrderWeekProduct) => {
                        return acc + curr.quantity;
                    },
                    0
                ),
            };
        });

        return result;
    };

    const handleRemoveDuplicate = (
        data: globalInterface.ChartData[]
    ): globalInterface.ChartData[] => {
        let dateArray: globalInterface.ChartData[] = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            let startOfWeek: any | string = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - i
            );

            dateArray.push({
                date: moment(startOfWeek).format("DD-MM-YYYY"),
                quantity: 0,
            });
        }

        data.map((item: globalInterface.ChartData) => {
            const index = dateArray.findIndex(
                (item1: globalInterface.ChartData) => item1.date === item.date
            );
            if (index >= 0) {
                dateArray[index].quantity += 1;
            }
            return [];
        });
        return dateArray;
    };

    const handleChartScaleMax = (data: globalInterface.ChartData[]): void => {
        const maxQuantity = data.reduce(
            (max: number, item: globalInterface.ChartData) => {
                return item.quantity > max ? item.quantity : max;
            },
            0
        );
        const roundedNumber = Math.ceil(maxQuantity / 10) * 10;
        setChartScaleMax((pre) => (pre < roundedNumber ? roundedNumber : pre));
    };

    const getOrderOfWeek = async (): Promise<void> => {
        const res: globalInterface.OrderWeek[] =
            await orderService.getOrderOfWeek({
                axiosJWT: axiosCreateJWT(
                    currentAccount,
                    dispatch,
                    loginSuccess
                ),
                headers: {
                    token: currentAccount?.token,
                },
            });

        handleTotalProductOrder(res);
        const result = handleTotalProductOrder(res);
        dispatch(setOrderWeek(result));
        dispatch(setReloadChart());
        const filterDuplicateDate = handleRemoveDuplicate(result);
        setCharOrderData(filterDuplicateDate);
        handleChartScaleMax(result);
    };

    const getBookingOfWeek = async () => {
        const res: globalInterface.BookingWeek[] =
            await bookingService.bookingWeek({
                axiosJWT: axiosCreateJWT(
                    currentAccount,
                    dispatch,
                    loginSuccess
                ),
                headers: {
                    token: currentAccount?.token,
                },
            });

        const result = res.map((item) => {
            return {
                date: item.date,
                quantity: 0,
            };
        });

        const filterDuplicateDate = handleRemoveDuplicate(result);
        setChartBookingData(filterDuplicateDate);
        handleChartScaleMax(result);
    };

    useEffect(() => {
        getOrderOfWeek();
        getBookingOfWeek();
    }, []);

    useEffect(() => {
        if (lineChartRef.current) {
            const lineChart = new Chart(lineChartRef.current, {
                type: "line",
                data: {
                    labels: chartOrderData
                        .reverse()
                        .map((item: globalInterface.ChartData) =>
                            moment(item.date, "DD-MM-YYY").format("DD-MM")
                        ),
                    datasets: [
                        {
                            label: "Order",
                            data: chartOrderData.map((row) => row.quantity),
                            tension: 0.2,
                            borderWidth: 1.5,
                            pointBorderWidth: 0.5,
                        },
                        {
                            label: "Booking",
                            data: chartBookingData
                                .reverse()
                                .map((row) => row.quantity),
                            tension: 0.2,
                            borderWidth: 1.5,
                            pointBorderWidth: 0.5,
                        },
                    ],
                },
                options: {
                    plugins: {
                        tooltip: {
                            enabled: true,
                        },
                        legend: {
                            display: false,
                            position: "bottom",
                        },

                        title: {
                            display: true,
                            text: "Quantity booking and order 7 days",
                            font: {
                                size: 14,
                                family: "arial",
                                weight: "500",
                            },
                        },
                    },
                    scales: {
                        y: {
                            type: "linear",
                            min: 0,
                            max: chartScaleMax,
                        },
                    },
                },
            });
            return () => {
                // Cleanup the chart instance
                lineChart.destroy();
            };
        }
    }, [chartOrderData]);

    return (
        <div style={{ width: "590px" }}>
            <canvas ref={lineChartRef} id="acquisitions" />
        </div>
    );
}

export default LineChart;
