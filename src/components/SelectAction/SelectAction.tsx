import styles from "./SelectAction.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
interface SelectAction {
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    type: string;
    data: { title: string; value: string }[];
    name: string;
    currentStatus: string;
}
function SelectAction({
    onChange,
    type,
    data,
    name,
    currentStatus,
}: SelectAction) {
    return (
        <select
            name={name}
            onChange={(e) => onChange(e)}
            className={cx("select", type)}
            value={currentStatus}
        >
            {data.map((status, index) => (
                <option value={status.value} key={index}>
                    {status.title}
                </option>
            ))}
        </select>
    );
}

export default SelectAction;