import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addPageCount } from "../../redux/slice/globalSlice";
import HomeIcon from "@mui/icons-material/Home";
import Card from "../../components/Card/Card";
import * as globalInterface from "../../types";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import TableBarOutlinedIcon from "@mui/icons-material/TableBarOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const cx = classNames.bind(styles);

function Home() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(addPageCount(0));
    }, []);
    const cardData: globalInterface.CardData[] = [
        {
            mainTitle: 1200000,
            titleHeader: "Total Sale",
            footerTitle: "Increase by 70%",
            Icon: AttachMoneyIcon,
            cardColor: "#140062",
        },
        {
            mainTitle: 123232,
            titleHeader: "Order ",
            footerTitle: "Increase by 56%",
            Icon: TrendingUpIcon,
            cardColor: "#9101b9",
        },
        {
            mainTitle: 123232,
            titleHeader: "Booking",
            footerTitle: "Increase by 23%",
            Icon: BookmarkBorderIcon,
            cardColor: "#00a293",
        },
        {
            mainTitle: 123232,
            titleHeader: "Table available",
            footerTitle: "Have some table",
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
                            Icon={card.Icon}
                            mainTitle={card.mainTitle}
                            titleHeader={card.titleHeader}
                            footerTitle={card.footerTitle}
                            cardColor={card.cardColor}
                        />
                    ))}
                </section>
            </div>
        </div>
    );
}

export default Home;
