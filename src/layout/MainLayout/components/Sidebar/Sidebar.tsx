import { NavLink } from "react-router-dom";
import classNames from "classnames/bind";
import LogoutIcon from "@mui/icons-material/Logout";
import styles from "./Sidebar.module.scss";
import brandLogo from "../../../../assets/image/ggz5_8m3m_210608.jpg";
import config from "../../../../config";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as selectorState from "../../../../redux/selector";
import * as staticData from "../../../../data";
import {
    logOutStart,
    loginSuccess,
    logOutSuccess,
    logOutFail,
} from "../../../../redux/slice/authSlice";
import * as authService from "../../../../services/authService";
import { axiosCreateJWT } from "../../../../util/jwtRequest";
const cx = classNames.bind(styles);
interface SidebarProps {
    className: string;
}

function Sidebar({ className }: SidebarProps) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentAccount = useSelector(selectorState.selectCurrentAccount);

    const handleLogout = async () => {
        dispatch(logOutStart());
        try {
            await authService.logout({
                headers: {
                    token: currentAccount?.token,
                },
                axiosJWT: axiosCreateJWT(
                    currentAccount,
                    dispatch,
                    loginSuccess
                ),
            });
            dispatch(logOutSuccess());
            navigate("/login");
        } catch (error) {
            console.log(error);
            dispatch(logOutFail());
        }
    };

    return (
        <div className={cx(className, "sidebar")}>
            <div className={cx("brand")}>
                <img className={cx("brand-image")} src={brandLogo} alt="" />
                <h1 className={cx("brand-name")}>Pizza RS</h1>
            </div>
            <h3>{`Welcome ${currentAccount?.account.username}`}</h3>
            <nav className={cx("nav-list")}>
                {staticData.navList.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.to}
                        className={(nav) =>
                            cx("nav-item", className, { active: nav.isActive })
                        }
                    >
                        <item.icon className={cx("nav-icon")} />
                        <p className={cx("nav-title")}>{item.title}</p>
                    </NavLink>
                ))}
                <NavLink
                    to={""}
                    className={(nav) => cx("nav-item", className)}
                    onClick={handleLogout}
                >
                    <LogoutIcon></LogoutIcon>
                    <p className={cx("nav-title")}>Logout</p>
                </NavLink>
            </nav>
        </div>
    );
}

export default Sidebar;
