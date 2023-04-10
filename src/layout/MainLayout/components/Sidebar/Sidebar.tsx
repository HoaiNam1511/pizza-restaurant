import React from "react";
import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";
import brandLogo from "../../../../assets/image/ggz5_8m3m_210608.jpg";
import { NavLink } from "react-router-dom";
import config from "../../../../config";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalPizzaOutlinedIcon from "@mui/icons-material/LocalPizzaOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import TableBarOutlinedIcon from "@mui/icons-material/TableBarOutlined";

const cx = classNames.bind(styles);

interface typeProps {
    className: string;
}

interface typeNavList {
    to: string;
    title: string;
    icon: any;
}

function Sidebar({ className }: typeProps) {
    const navList: typeNavList[] = [
        {
            to: config.routes.home,
            title: "Dashboard",
            icon: HomeOutlinedIcon,
        },
        {
            to: config.routes.product,
            title: "Product",
            icon: LocalPizzaOutlinedIcon,
        },
        {
            to: config.routes.category,
            title: "Category",
            icon: CategoryOutlinedIcon,
        },
        {
            to: config.routes.order,
            title: "Order",
            icon: ShoppingCartOutlinedIcon,
        },
        {
            to: config.routes.booking,
            title: "Booking",
            icon: BookmarkAddedOutlinedIcon,
        },
        {
            to: config.routes.table,
            title: "Table",
            icon: TableBarOutlinedIcon,
        },
        {
            to: config.routes.user,
            title: "Account",
            icon: PersonOutlineOutlinedIcon,
        },
    ];

    return (
        <div className={cx(className, "sidebar")}>
            <div
                className={cx(
                    "d-flex align-items-center justify-content-center",
                    "brand"
                )}
            >
                <img className={cx("brand-image")} src={brandLogo} alt="" />
                <h1 className={cx("brand-name")}>Pizza RS</h1>
            </div>
            <nav className={cx("nav-list")}>
                {navList.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.to}
                        className={(nav) =>
                            cx(
                                "d-flex align-items-center",
                                "nav-item",
                                className,
                                { active: nav.isActive }
                            )
                        }
                    >
                        <item.icon className={cx("nav-icon")} />
                        <p className={cx("nav-title")}>{item.title}</p>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}

export default Sidebar;
