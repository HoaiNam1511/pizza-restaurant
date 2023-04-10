import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addPageCount } from "../../redux/slice/globalSlice";

const cx = classNames.bind(styles);
function Home() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(addPageCount(0));
    }, []);
    return <div></div>;
}

export default Home;
