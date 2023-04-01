import { httpRequestProduct } from "../util/httpRequest";
import { Product } from "../pages/Product/Product";

export const createProduct = async (product: Product) => {
    console.log("come");
    const res = await httpRequestProduct.post("/create", product);
    return res.data;
};
