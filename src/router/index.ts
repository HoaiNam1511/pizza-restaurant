import MainLayout from "../layout/MainLayout/MainLayout";
import config from "../config";
import Home from "../pages/Home/Home";
import Product from "../pages/Product/Product";

const routers = [
    {
        path: config.routes.home,
        page: Home,
        layout: MainLayout,
    },
    {
        path: config.routes.product,
        page: Product,
        layout: MainLayout,
    },
];
export default routers;
