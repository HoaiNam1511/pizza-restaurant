import moment from "moment";
import Chart from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Chart as ChartJS, BarController, BarElement } from "chart.js";

import * as orderService from "../../services/orderService";
import * as bookingService from "../../services/bookingService";
import * as selectorState from "../../redux/selector";
import * as globalInterface from "../../types";

import { axiosCreateJWT } from "../../util/jwtRequest";
import { loginSuccess } from "../../redux/slice/authSlice";
import { setOrderWeek } from "../../redux/slice/orderSlice";

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

    //Function create array 7 days
    const createArrayWeek = () => {
        let dateArray: globalInterface.ChartData[] = [];

        //Create new label and quantity for chart
        const today: Date = new Date();
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
        return dateArray;
    };

    //Handle total product order of 7 days
    const handleTotalProductOrder = (data: globalInterface.OrderWeek[]) => {
        const arrWeek: globalInterface.ChartData[] = createArrayWeek();
        data?.forEach((item: globalInterface.OrderWeek) => {
            const index = arrWeek.findIndex(
                (item1: globalInterface.ChartData) => item1.date === item.date
            );
            if (index >= 0) {
                arrWeek[index].quantity += item?.products?.reduce(
                    (acc: number, curr: globalInterface.OrderWeekProduct) => {
                        return acc + curr.quantity;
                    },
                    0
                );
            }
            return arrWeek;
        });
        return arrWeek;
    };

    //Remove duplicate date from data
    const handleRemoveDuplicate = (
        data: globalInterface.ChartData[]
    ): globalInterface.ChartData[] => {
        const dataRemoveDuplicate: globalInterface.ChartData[] =
            createArrayWeek();
        //Handle total quantity for chart
        data.forEach((item: globalInterface.ChartData) => {
            const index = dataRemoveDuplicate.findIndex(
                (item1: globalInterface.ChartData) => item1.date === item.date
            );
            if (index >= 0) {
                dataRemoveDuplicate[index].quantity += 1;
            }
        });
        return dataRemoveDuplicate;
    };

    //Handle total max chart scale Y
    const handleChartScaleMax = (data: globalInterface.ChartData[]): void => {
        const maxQuantity: number = data?.reduce(
            (max: number, item: globalInterface.ChartData) => {
                return item.quantity > max ? item.quantity : max;
            },
            0
        );
        const roundedNumber: number = Math.ceil(maxQuantity / 10) * 10;
        setChartScaleMax((pre: number) =>
            pre < roundedNumber ? roundedNumber : pre
        );
    };

    //Api: get order week
    const getOrderOfWeek = async (): Promise<void> => {
        try {
            const res = await orderService.getOrderOfWeek({
                axiosJWT: axiosCreateJWT(
                    currentAccount,
                    dispatch,
                    loginSuccess
                ),
                headers: {
                    token: currentAccount?.token,
                },
            });
            if (Array.isArray(res)) {
                const result: globalInterface.ChartData[] =
                    handleTotalProductOrder(res);
                const filterDuplicateDate: globalInterface.ChartData[] =
                    handleRemoveDuplicate(res);
                dispatch(setOrderWeek(result));
                setCharOrderData(filterDuplicateDate);
                handleChartScaleMax(filterDuplicateDate);
            }
        } catch (err) {
            console.log(err);
        }
    };

    //Api: get booking week
    const getBookingOfWeek = async (): Promise<void> => {
        try {
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
            //Convert data booking to chart data type
            if (Array.isArray(res)) {
                const result: globalInterface.ChartData[] = res?.map((item) => {
                    return {
                        date: item.date,
                        quantity: 0,
                    };
                });

                const filterDuplicateDate = handleRemoveDuplicate(result);
                setChartBookingData(filterDuplicateDate);
                handleChartScaleMax(filterDuplicateDate);
            }
        } catch (err) {
            console.log(err);
        }
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
                        ?.map((item: globalInterface.ChartData) =>
                            moment(item.date, "DD-MM-YYY").format("DD-MM")
                        ),
                    datasets: [
                        {
                            label: "Order",
                            data: chartOrderData?.map((row) => row.quantity),
                            tension: 0.2,
                            borderWidth: 1.5,
                            pointBorderWidth: 0.5,
                        },
                        {
                            label: "Booking",
                            data: chartBookingData
                                .reverse()
                                ?.map((row) => row.quantity),
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
