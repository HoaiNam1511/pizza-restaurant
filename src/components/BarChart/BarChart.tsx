import moment from "moment";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Chart as ChartJS, BarController, BarElement } from "chart.js";

import * as selectorState from "../../redux/selector";
import * as globalInterface from "../../types";

ChartJS.register(BarController, BarElement);

function BarChart() {
    const barChartRef = useRef<any>(null);
    const [chartScaleMax, setChartScaleMax] = useState<number>(0);
    const [chartData, setChartData] = useState<globalInterface.ChartData[]>([]);
    const selectOrderWeek = useSelector(selectorState.selectOrderWeek);

    //Handle remove duplicate date
    const handleFilterDuplicateDate = (): void => {
        const filterDuplicateDate = selectOrderWeek?.reduce(
            (
                acc: globalInterface.ChartData[],
                curr: globalInterface.ChartData
            ) => {
                const index = acc.findIndex(
                    (item: globalInterface.ChartData) =>
                        item?.date === curr?.date
                );
                if (index >= 0) {
                    acc[index].quantity += curr?.quantity;
                } else {
                    acc.push({ date: curr.date, quantity: curr.quantity });
                }
                return acc;
            },
            []
        );
        setChartData(filterDuplicateDate);
    };

    //Chart scale Y
    const handleChartScaleMax = (): void => {
        const maxQuantity = chartData.reduce(
            (max: number, item: globalInterface.ChartData) => {
                return item?.quantity > max ? item?.quantity : max;
            },
            0
        );
        const roundedNumber = Math.ceil(maxQuantity / 10) * 10;
        setChartScaleMax(roundedNumber);
    };

    useEffect(() => {
        if (barChartRef.current) {
            const barChart: ChartJS<"bar", number[] | string> = new Chart(
                barChartRef.current,
                {
                    type: "bar",
                    data: {
                        labels: chartData
                            .reverse()
                            .map((row) =>
                                moment(row.date, "YYYY.MM.DD").format("DD-MM")
                            ),
                        datasets: [
                            {
                                label: "Quantity",
                                data: chartData.map((row) => row.quantity),
                                barThickness: 40,
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
                                text: "Order Quantity of Weeks",
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
                }
            );

            return () => {
                // Cleanup the chart instance
                barChart.destroy();
            };
        }
    }, [chartScaleMax]);

    useEffect(() => {
        handleFilterDuplicateDate();
    }, [selectOrderWeek]);

    useEffect(() => {
        handleChartScaleMax();
    }, [chartData]);

    return (
        <div style={{ width: "590px" }}>
            <canvas ref={barChartRef} id="acquisitions" />
        </div>
    );
}

export default BarChart;
