import MainLayout from "../layout/MainLayout/MainLayout";
import config from "../config";
import Home from "../pages/Home/Home";
import Product from "../pages/Product/Product";
import Category from "../pages/Category/Category";
import Order from "../pages/Order/Order";
import Booking from "../pages/Booking/Booking";
import User from "../pages/Account/Account";
import Table from "../pages/Table/Table";
import ResetPassword from "../pages/Login/ResetPassword";

const routers = [
    {
        path: config.routes.dashboard,
        page: Home,
        layout: MainLayout,
    },
    {
        path: config.routes.product,
        page: Product,
        layout: MainLayout,
    },
    {
        path: config.routes.category,
        page: Category,
        layout: MainLayout,
    },
    {
        path: config.routes.order,
        page: Order,
        layout: MainLayout,
    },
    {
        path: config.routes.booking,
        page: Booking,
        layout: MainLayout,
    },
    {
        path: config.routes.user,
        page: User,
        layout: MainLayout,
    },
    {
        path: config.routes.table,
        page: Table,
        layout: MainLayout,
    },
];
export default routers;
