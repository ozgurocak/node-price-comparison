import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductDetails } from "../API";
import "../index.css";

export const ProductDetails = (props) => {
    const [prodDetails, setProdDetails] = useState([]);
    const { product_id } = useParams();

    useEffect(() => {
        getProductDetails(product_id).then(res => {setProdDetails(res.data); console.log(res.data)});
    }, []);

    return(
        <div className="details-content-container">
            {prodDetails.map((prod, index) => {
                if(index == 0)
                    return <div className="details-container">
                            <div className="details-left">
                                <div className="details-image" style={{backgroundImage: "url("+prod.img+")"}}></div>
                            </div>
                            <div className="details-right">
                                <h1>{prod.brand_name} {prod.model}</h1>
                                <hr />
                                <h2>Mağaza Fiyatları</h2>
                                <table className="price-table">
                                {prodDetails.map(prod2 => 
                                    <tr>
                                        <td><a href={prod2.url}>{prod2.s_name}</a></td>
                                        <td><b>{prod2.price} TL</b></td>
                                    </tr>
                                    
                                )}
                                </table>
                            </div>
                        </div>
            })}
            <div className="box">
                <h1>Teknik Özellikler</h1>
                <hr />
                <big><table className="tech-table">
                    {prodDetails.map((prod, index) => {
                        if(index == 0)
                            return <>
                            <tr>
                                <td>Marka</td>
                                <td>{prod.brand_name}</td>
                            </tr>
                            <tr>
                                <td>RAM Boyutu</td>
                                <td>{prod.ram}</td>
                            </tr>
                            <tr>
                                <td>İşlemci Modeli</td>
                                <td>{prod.proc_model}</td>
                            </tr>
                            <tr>
                                <td>İşlemci Nesli</td>
                                <td>{prod.proc_gen}</td>
                            </tr>
                            <tr>
                                <td>İşletim Sistemi</td>
                                <td>{prod.os_name}</td>
                            </tr>
                            <tr>
                                <td>Depolama Kapasitesi</td>
                                <td>{prod.cap}</td>
                            </tr>
                            <tr>
                                <td>Depolama Türü</td>
                                <td>{prod.storage}</td>
                            </tr>
                            <tr>
                                <td>Ekran Boyutu</td>
                                <td>{prod.screen_dim}</td>
                            </tr>
                            </>
                    })}
                </table></big>
            </div>
        </div>
    );
}