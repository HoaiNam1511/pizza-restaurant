import styles from "./CheckboxCustom.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
interface CheckboxCustomProps {
    id: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    labelRight?: boolean;
}
function CheckboxCustom({
    id,
    value,
    onChange,
    labelRight = false,
}: CheckboxCustomProps) {
    return (
        <div className={cx("checkbox-item")}>
            {!labelRight && (
                <label className={cx("label")} htmlFor="">
                    Show password
                </label>
            )}

            <div className={cx("checkbox-1")}>
                <input
                    type="checkbox"
                    className={cx("order-ckb")}
                    id={id}
                    value={value}
                    onChange={onChange}
                />
                <label htmlFor={id} className={cx("order-ckb-label")} />
            </div>
            {labelRight && (
                <label className={cx("label")} htmlFor="">
                    Show password
                </label>
            )}
        </div>
    );
}

export default CheckboxCustom;
