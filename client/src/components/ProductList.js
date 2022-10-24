import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts, getProductsHP, getProductsHS, getProductsLP, getProductsLS, getSearchResults } from '../API';
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

export const SearchedProductList = () => {
    const [prodArray, setProdArray] = useState([]);
    let params = useParams();
    const searchstring = params.searchstring;

    useEffect(() => {
        getSearchResults(searchstring).then(res => setProdArray(res.data));
    }, []);

    return(
        <div className="products-container">
            {prodArray.map((product) => 
                <a className="product-card-link" href={"/product/"+product.pid}><ProductCard product={product}/></a>
            )}
        </div>
    );
};