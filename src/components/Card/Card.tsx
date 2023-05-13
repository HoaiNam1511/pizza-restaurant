import classNames from "classnames/bind";
import styles from "./Card.module.scss";
import ShowChartIcon from "@mui/icons-material/ShowChart";

const cx = classNames.bind(styles);

interface CardProps {
    className?: string;
    Icon: any;
    titleHeader: string;
    mainTitle: string | number;
    footerTitle: string;
    cardColor?: string;
}

function Card({
    className,
    Icon = ShowChartIcon,
    titleHeader = "Weekly sale",
    mainTitle = "12,345",
    footerTitle = "Increase by 50%",
    cardColor,
}: CardProps) {
    return (
        <div
            className={cx("card", className)}
            style={{
                background: `linear-gradient(to right, ${cardColor} 0%, #696cff 100%)`,
            }}
        >
            <div className={cx("header-title")}>
                <h3 className={cx("header-title_left")}>{titleHeader}</h3>
                <Icon />
            </div>

            <div className={cx("main-title")}>
                <h2>{mainTitle}</h2>
            </div>

            <div className={cx("footer-title")}>
                <h4>{footerTitle}</h4>
            </div>
        </div>
    );
}

export default Card;
