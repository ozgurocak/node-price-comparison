import { useEffect, useState } from 'react';
import { getProductData } from '../API';
import '../index.css'

export const ProductCard = (props) => {
    const pid = props.product.pid;
    const [pricesArray, setPricesArray] = useState([]);

    useEffect(() => {
        getProductData(pid).then(res => setPricesArray(res.data));
    }, []);

    return(
        <div className="product-card">
            <div className="product-image" style={{backgroundImage: "url("+props.product.img+")"}}></div>
            <p className="product-model"><b>{props.product.brand_name}</b> {props.product.model}</p>
            <table>
            {pricesArray.map(price => 
                <tr>
                    <td className="price-site-name">{price.s_name.split(" ")[0]}</td>
                    <td><b>{price.price} TL</b></td>
                </tr>
            )}
            </table>
        </div>
    );
}