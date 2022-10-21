import Axios from "axios"

Axios.defaults.baseURL = "http://localhost:8080";

export async function getProducts(){
    return await Axios.get("/getproducts");
}

export async function getProductsHP(){
    return await Axios.get("/getproductshighestprice");
}

export async function getProductsLP(){
    return await Axios.get("/getproductslowestprice");
}

export async function getProductsHS(){
    return await Axios.get("/getproductshighestscore");
}

export async function getProductsLS(){
    return await Axios.get("/getproductslowestscore");
}

export async function getProductData(product_id){
    return await Axios.get("/getproductdata?product_id="+product_id);
}

export async function getBrands(){
    return await Axios.get("/getbrands");
}

export async function getProcessors(){
    return await Axios.get("/getprocessors");
}

export async function getOs(){
    return await Axios.get("/getos");
}

export async function getRam(){
    return await Axios.get("/getram");
}

export async function getCapacity(){
    return await Axios.get("/getcap");
}

export async function getStorages(){
    return await Axios.get("/getstorages");
}

export async function getProductsFiltered(min_price, max_price, brand_id, ram_id, proc_id, cap_id, storage_id){
    let query = "";
    query += (min_price !== null) ? ("min_price="+min_price + "&") : "";
    query += (max_price !== null) ? ("max_price="+max_price + "&") : "";
    query += (brand_id !== null) ? ("brand_id="+brand_id + "&") : "";
    query += (ram_id !== null) ? ("ram_id="+ram_id + "&") : "";
    query += (proc_id !== null) ? ("proc_id="+proc_id + "&") : "";
    query += (cap_id !== null) ? ("cap_id="+cap_id + "&") : "";
    query += (storage_id !== null) ? ("storage_id="+storage_id + "&") : "";

    return await Axios.get("/getproductsfiltered?"+query);
}

export async function getProductDetails(product_id){
    return await Axios.get("/getproductdetails?product_id="+product_id);
}