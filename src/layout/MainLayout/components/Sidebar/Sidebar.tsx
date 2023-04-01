import React from "react";
import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";
import brandLogo from "../../../../assets/image/ggz5_8m3m_210608.jpg";
import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import config from "../../../../config";

const cx = classNames.bind(styles);

interface typeProps {
    className: string;
}

interface typeNavList {
    to: string;
    title: string;
    icon: React.ReactElement<any>;
}

function Sidebar({ className }: typeProps) {
    const navList: typeNavList[] = [
        {
            to: config.routes.home,
            title: "Dashboard",
            icon: <HomeIcon />,
        },
        {
            to: config.routes.product,
            title: "Product",
            icon: <LocalPizzaIcon />,
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
                        <HomeIcon className={cx("nav-icon")} />
                        <p className={cx("nav-title")}>{item.title}</p>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}

export default Sidebar;
