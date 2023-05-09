import classNames from "classnames/bind";
import SearchIcon from "@mui/icons-material/Search";

import styles from "./Navbar.module.scss";
import avatar from "../../../../assets/image/10219.jpg";
const cx = classNames.bind(styles);

interface navbarPropsType {
    className?: string;
}

function Navbar({ className }: navbarPropsType) {
    return (
        <div
            className={cx(
                className,
                "d-flex align-items-center justify-content-between",
                "navbar"
            )}
        >
            <div>
                <SearchIcon className={cx("navbar-icon_search")}></SearchIcon>
                <input
                    className={cx("navbar-input")}
                    placeholder="Search"
                ></input>
            </div>
            <div>
                <img className={cx("avatar")} src={avatar} alt="" />
            </div>
        </div>
    );
}

export default Navbar;
