import * as globalInterface from "../types";
import config from "../config";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalPizzaOutlinedIcon from "@mui/icons-material/LocalPizzaOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import TableBarOutlinedIcon from "@mui/icons-material/TableBarOutlined";

export const orderStatusData: globalInterface.OrderStatusData[] = [
    { title: "Pending", value: "pending" },
    { title: "Confirmed", value: "confirm" },
    { title: "Shipping", value: "shipping" },
    { title: "Shipped", value: "shipped" },
    { title: "Cancel", value: "cancel" },
];

export const paymentStatusData: globalInterface.OrderStatusData[] = [
    { title: "Unpaid", value: "unpaid" },
    { title: "Paid", value: "paid" },
];

export const columnTable: globalInterface.ColumnTableOrder = {
    orderDate: "order_date",
    quantity: "quantity",
    total: "total",
    id: "id",
    price: "price",
    bookingDate: "booking_date",
    bookingTime: "booking_time",
};

export const bookingStatusData: globalInterface.OrderStatusData[] = [
    { title: "Pending", value: "pending" },
    { title: "Confirm", value: "confirm" },
    { title: "Eating", value: "eat" },
    { title: "Done", value: "done" },
    { title: "Cancel", value: "cancel" },
];

export const partySizeData: globalInterface.PartySizeData[] = [
    { title: "1 people", value: 1, quantity: 0 },
    { title: "2 people", value: 2, quantity: 0 },
    { title: "3 people", value: 3, quantity: 0 },
    { title: "4 people", value: 4, quantity: 0 },
    { title: "6 people", value: 6, quantity: 0 },
    { title: "8 people", value: 8, quantity: 0 },
];

export const accountStatus: globalInterface.TitleValueNumber[] = [
    {
        title: "Enable",
        value: 1,
    },
    {
        title: "Disable",
        value: 0,
    },
];

export const navList: globalInterface.NavList[] = [
    {
        to: config.routes.dashboard,
        title: "Dashboard",
        icon: HomeOutlinedIcon,
    },
    {
        to: config.routes.product,
        title: "Product",
        icon: LocalPizzaOutlinedIcon,
    },
    {
        to: config.routes.category,
        title: "Category",
        icon: CategoryOutlinedIcon,
    },
    {
        to: config.routes.order,
        title: "Order",
        icon: ShoppingCartOutlinedIcon,
    },
    {
        to: config.routes.booking,
        title: "Booking",
        icon: BookmarkAddedOutlinedIcon,
    },
    {
        to: config.routes.table,
        title: "Table",
        icon: TableBarOutlinedIcon,
    },
    {
        to: config.routes.user,
        title: "Account",
        icon: PersonOutlineOutlinedIcon,
    },
];
