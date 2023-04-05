import classNames from "classnames/bind";
import styles from "./UploadImage.module.scss";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
const cx = classNames.bind(styles);

interface UploadImageProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    image: File | string | null;
}

function UploadImage({ onChange, image }: UploadImageProps) {
    return (
        <div className={cx("row g-0", "image-container")}>
            <input
                type="file"
                multiple={false}
                id="upload"
                onChange={(e) => onChange(e)}
                className={cx("d-none", "upload")}
            />
            <label
                htmlFor="upload"
                className={cx(
                    "col-5 d-flex flex-column justify-content-center align-items-center",
                    "upload-container"
                )}
            >
                <CloudUploadIcon className={cx("upload-icon")} />
                <div className={cx("upload-title")}>Choose image</div>
            </label>
            <div className={cx("col-7")}>
                {image ? (
                    <img
                        className={cx("image")}
                        src={
                            typeof image === "string"
                                ? `${process.env.REACT_APP_SERVER_URL}/images/${image}`
                                : URL.createObjectURL(image)
                        }
                        alt=""
                    />
                ) : (
                    <ImageSearchIcon className={cx("empty-image")} />
                )}
            </div>
        </div>
    );
}

export default UploadImage;
