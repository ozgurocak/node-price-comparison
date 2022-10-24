import { useEffect, useState } from "react";
import { createSearchParams, Outlet, useNavigate } from "react-router-dom";
import { getBrands, getCapacity, getOs, getProcessors, getRam, getStorages } from "../API";

export const Browser = () => {
    const [brandList, setBrandList] = useState([]);
    const [ramList, setRamList] = useState([]);
    const [procList, setProcList] = useState([]);
    const [osList, setOsList] = useState([]);
    const [capList, setCapList] = useState([]);
    const [storageList, setStorageList] = useState([]);
    const [searchstr, setSearchStr] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        getBrands().then(res => setBrandList(res.data));
        getRam().then(res => setRamList(res.data));
        getProcessors().then(res => setProcList(res.data));
        getCapacity().then(res => setCapList(res.data));
        getStorages().then(res => setStorageList(res.data));
    }, []);

    const handleFilter = (event) => {
        const params = {
            min_price: event.target.min_price.value,
            max_price: event.target.max_price.value,
            brand_filter: event.target.brand_filter.value,
            ram_filter: event.target.ram_filter.value,
            proc_filter: event.target.proc_filter.value,
            cap_filter: event.target.cap_filter.value,
            storage_filter: event.target.storage_filter.value
        };
        navigate({
            pathname: "/browse/products/filtered",
            search: `?${createSearchParams(params)}`
        });
    }

    const handleSearch = (e) => {
        const navstr = "/browse/products/search/"+searchstr;
        navigate(navstr);
    };

    return(
    <div className="content-container">
        <div className="filter-box">
            <h2>Filtreler</h2>
            <hr />
            <form class="filter-form" onSubmit={handleFilter}>
                <h3 style={{textAlign: "left"}}>Fiyat aralığı</h3>
                <input type="text" id="min_price" name="min_price"></input> - <input type="text" id="max_price" name="max_price"></input>
                <input type="submit" value="Ara"/>
                <hr />
                <h3 style={{textAlign: "left"}}>Marka</h3>
                {brandList.map(item => 
                <div className="radio-filter">
                    <input type="radio" id={item.brand_id} value={item.brand_id} name="brand_filter" />
                    <label for={item.brand_id}>{item.brand_name}</label>
                </div>
                )}
                <hr />
                <h3 style={{textAlign: "left"}}>RAM Boyutu</h3>
                {ramList.map(item => 
                <div className="radio-filter">
                    <input type="radio" id={item.ram_id} value={item.ram_id} name="ram_filter" />
                    <label for={item.ram_id}>{item.ram}</label>
                </div>
                )}
                <hr />
                <h3 style={{textAlign: "left"}}>İşlemci</h3>
                {procList.map(item => 
                <div className="radio-filter">
                    <input type="radio" id={item.proc_id} value={item.proc_id} name="proc_filter" />
                    <label for={item.proc_id}>{item.proc_model}</label>
                </div>
                )}
                <hr />
                <h3 style={{textAlign: "left"}}>Disk Kapasitesi</h3>
                {capList.map(item => 
                <div className="radio-filter">
                    <input type="radio" id={item.cap_id} value={item.cap_id} name="cap_filter" />
                    <label for={item.cap_id}>{item.cap}</label>
                </div>
                )}
                <hr />
                <h3 style={{textAlign: "left"}}>Disk Türü</h3>
                {storageList.map(item => 
                <div className="radio-filter">
                    <input type="radio" id={item.storage_id} value={item.storage_id} name="storage_filter" />
                    <label for={item.storage_id}>{item.storage}</label>
                </div>
                )}
                <input type="reset"/>
            </form>
        </div>
        <div className="product-browser">
          <div className="slim-bar">
            <div className="link-btn-container">
              <a className="link-btn" href="/browse/products/lowestprice">En Düşük Fiyat</a>
              <a className="link-btn" href="/browse/products/highestprice">En Yüksek Fiyat</a>
              <a className="link-btn" href="/browse/products/lowestscore">En Düşük Skor</a>
              <a className="link-btn" href="/browse/products/highestscore">En Yüksek Skor</a>
            </div>
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Ürün ara..." value={searchstr} onChange={val => setSearchStr(val.target.value)}/>
                <input type="submit" value="Ara" />
            </form>
          </div>
            <Outlet />
        </div>
    </div>
    );
}