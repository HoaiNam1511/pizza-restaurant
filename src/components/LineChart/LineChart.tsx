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
    const [chartLabel, setChartLabel] = useState<globalInterface.ChartData[]>(
        []
    );
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
        if (chartLabel[0]?.quantity === 0) {
            data.map((item: globalInterface.ChartData) => {
                const index = chartLabel.findIndex(
                    (item1: globalInterface.ChartData) =>
                        item1.date === item.date
                );
                if (index >= 0) {
                    chartLabel[index].quantity += 1;
                }
            });
        }

        return chartLabel;
        // let filterDuplicateDate = data.reduce(
        //     (
        //         acc: globalInterface.ChartData[],
        //         curr: globalInterface.ChartData
        //     ) => {
        //         const index = acc.findIndex(
        //             (item: globalInterface.ChartData) => item.date === curr.date
        //         );

        //         if (index >= 0) {
        //             acc[index].quantity += 1;
        //         } else {
        //             acc.push({ date: curr.date, quantity: 1 });
        //         }

        //         return acc;
        //     },
        //     []
        // );

        // const addDate = chartLabel.map((date: string) => {
        //     if (filterDuplicateDate.find((item: any) => item.date !== date)) {
        //         filterDuplicateDate.push({
        //             date: date,
        //             quantity: 0,
        //         });
        //     }
        // });
        // console.log(filterDuplicateDate);

        //return filterDuplicateDate;
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
        //setChartBookingData(filterDuplicateDate);
        // handleChartScaleMax(result);
    };

    const createChartLabel = () => {
        let dateArray = [];
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
        setChartLabel(dateArray);
    };

    useEffect(() => {
        createChartLabel();
    }, []);

    useEffect(() => {
        getOrderOfWeek();
        getBookingOfWeek();
    }, [chartLabel]);

    useEffect(() => {
        if (lineChartRef.current) {
            const lineChart = new Chart(lineChartRef.current, {
                type: "line",
                data: {
                    labels: chartLabel
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
                            data: chartBookingData.map((row) => row.quantity),
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
                            text: "Quantity Booking of Weeks",
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
