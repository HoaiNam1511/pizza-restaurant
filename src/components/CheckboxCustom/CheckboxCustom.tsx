import styles from "./CheckboxCustom.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
interface CheckboxCustomProps {
    id: string | number;
    value: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    labelRight?: boolean;
    className?: string;
    label?: string;
    checked?: boolean;
}
function CheckboxCustom({
    id,
    value,
    onChange,
    labelRight = false,
    className,
    label,
    checked,
}: CheckboxCustomProps) {
    return (
        <div className={cx("checkbox-item", className)}>
            {!labelRight && (
                <label className={cx("label")} htmlFor="">
                    {label}
                </label>
            )}

            <div className={cx("checkbox-container")}>
                <input
                    id={id as string}
                    type="checkbox"
                    className={cx("checkbox")}
                    value={value}
                    onChange={onChange}
                    checked={checked}
                />
                <label
                    htmlFor={id as string}
                    className={cx("checkbox-custom")}
                />
            </div>
            {labelRight && (
                <label className={cx("label")} htmlFor="">
                    {label}
                </label>
            )}
        </div>
    );
}

export default CheckboxCustom;
