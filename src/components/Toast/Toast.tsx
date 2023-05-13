import { toast } from "react-toastify";
import * as selectState from "../../redux/selector";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function Toast() {
    const toastNotification = useSelector(selectState.selectToast);
    let toastConfig = {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnFocusLoss: true,
    };

    useEffect(() => {
        switch (toastNotification.action) {
            case "add": {
                toast.success(toastNotification.message, toastConfig);
                break;
            }
            case "delete": {
                toast.error(toastNotification.message, toastConfig);
                break;
            }
            case "update": {
                toast.info(toastNotification.message, toastConfig);
                break;
            }
            case "warning": {
                toast.warning(toastNotification.message, toastConfig);
                break;
            }
            default:
        }
    }, [toastNotification]);

    return null;
}

export default Toast;
