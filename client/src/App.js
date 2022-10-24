import './App.css';
import { Route, Routes } from "react-router-dom"
import { ProductList, SearchedProductList } from './components/ProductList';
import { Browser } from './components/Browser';
import { FilteredProductList } from './components/FilteredProductList';
import { ProductDetails } from './components/ProductDetails';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/browse" element={<Browser />}>
          <Route path="products" element={<ProductList/>}/>
          <Route path="products/highestprice" element={<ProductList mode="hp"/>}/>
          <Route path="products/lowestprice" element={<ProductList mode="lp"/>}/>
          <Route path="products/highestscore" element={<ProductList mode="hs"/>}/>
          <Route path="products/lowestscore" element={<ProductList mode="ls"/>}/>
          <Route path="products/filtered" element={<FilteredProductList />}/>
          <Route path="products/search/:searchstring" element={<SearchedProductList />} />
        </Route>
        <Route path="/product/:product_id" element={<ProductDetails />}/>
      </Routes>
    </div>
  );
}

export default App;
