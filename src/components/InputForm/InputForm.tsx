import classNames from "classnames/bind";
import styles from "./InputForm.module.scss";

interface InputForm {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    name: string;
    type: string;
    placeholder: string;
    value: any;
    disabled?: boolean;
}

const cx = classNames.bind(styles);

function InputForm({
    name,
    type,
    placeholder,
    value,
    onChange,
    label,
    disabled,
}: InputForm) {
    return (
        <>
            <label className={cx("label")} htmlFor="">
                {label}
            </label>
            <input
                disabled={disabled}
                name={name}
                className={cx("input")}
                type={type}
                placeholder={placeholder}
                onChange={(e) => onChange(e)}
                value={value}
            />
        </>
    );
}

export default InputForm;
