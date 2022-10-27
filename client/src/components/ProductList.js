import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductCount, getProducts, getProductsHP, getProductsHS, getProductsLP, getProductsLS, getSearchResults } from '../API';
import '../index.css'
import { ProductCard } from './ProductCard';

export const ProductList = (props) => {
    const [prodArray, setProdArray] = useState([]);
    const mode = props.mode;
    const { pagenum } = useParams();
    const [productCount, setProductCount] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        //window.location.reload();
        if(mode === "hp")
            getProductsHP(pagenum).then(res => setProdArray(res.data));
        else if(mode === "lp")
            getProductsLP(pagenum).then(res => setProdArray(res.data));
        else if(mode === "hs")
            getProductsHS(pagenum).then(res => setProdArray(res.data));
        else if(mode === "ls")
            getProductsLS(pagenum).then(res => setProdArray(res.data));
        else
            getProducts(pagenum).then(res => setProdArray(res.data));

        getProductCount().then(res => {setProductCount(res.data[0].prod_count); console.log(res.data[0].prod_count)});
    }, []);


    const getPageUrl = (pagenum) => {
        let navstr = "/browse/products/";
        if(mode === "hp")
            navstr = navstr.concat("highestprice/"+pagenum);
        else if(mode === "lp")
            navstr = navstr.concat("lowestprice/"+pagenum);
        else if(mode === "hs")
            navstr = navstr.concat("highestscore/"+pagenum);
        else if(mode === "ls")
            navstr = navstr.concat("lowestscore/"+pagenum);
        else
            navstr = navstr.concat(pagenum);
        return navstr;
    }

    return (
        <>
        <div className="products-container">
            {prodArray.map((product) => 
                <a className="product-card-link" href={"/product/"+product.pid}><ProductCard product={product}/></a>
            )}
        </div>
        <div className="slim-bar" style={{"margin-top": "10px"}}>
            {[...Array(Math.ceil(parseInt(productCount)/30)).keys()].map(item =>
                <a className="page-button" href={getPageUrl(item)}>{item+1}</a>
            )}
        </div>
        </>
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