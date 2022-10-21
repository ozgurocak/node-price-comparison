import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductsFiltered } from "../API";
import { ProductCard } from "./ProductCard";

export const FilteredProductList = (props) => {
    const [prodArray, setProdArray] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        getProductsFiltered(searchParams.get("min_price"), searchParams.get("max_price"), searchParams.get("brand_filter"), searchParams.get("ram_filter"), searchParams.get("proc_filter"), searchParams.get("cap_filter"), searchParams.get("storage_filter")).then(
            res => {setProdArray(res.data); console.log(res.data);}
        );
    }, []);

    return (
        <div className="products-container">
            {prodArray.map((product) => 
                <a className="product-card-link" href={"/product/"+product.pid}><ProductCard product={product}/></a>
            )}
        </div>
    );
};