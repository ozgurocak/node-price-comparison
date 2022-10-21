import { useEffect, useState } from 'react';
import { getProducts, getProductsHP, getProductsHS, getProductsLP, getProductsLS } from '../API';
import '../index.css'
import { ProductCard } from './ProductCard';

export const ProductList = (props) => {
    const [prodArray, setProdArray] = useState([]);
    const mode = props.mode;

    useEffect(() => {
        //window.location.reload();
        if(mode === "hp")
            getProductsHP().then(res => setProdArray(res.data));
        else if(mode === "lp")
            getProductsLP().then(res => setProdArray(res.data));
        else if(mode === "hs")
            getProductsHS().then(res => setProdArray(res.data));
        else if(mode === "ls")
            getProductsLS().then(res => setProdArray(res.data));
        else
            getProducts().then(res => setProdArray(res.data));
    }, []);

    return (
        <div className="products-container">
            {prodArray.map((product) => 
                <a className="product-card-link" href={"/product/"+product.pid}><ProductCard product={product}/></a>
            )}
        </div>
    );
};