import './App.css';
import { Link, Route, Routes } from "react-router-dom"
import { ProductList } from './components/ProductList';

function App() {
  return (
    <div className="App">
      <div className="content-container">
        <div className="box"></div>
        <div>
          <div className="slim-bar">
            <div className="link-btn-container">
              <Link className="link-btn" to="">En Düşük Fiyat</Link>
              <Link className="link-btn" to="">En Yüksek Fiyat</Link>
              <Link className="link-btn" to="">En Düşük Skor</Link>
              <Link className="link-btn" to="">En Yüksek Skor</Link>
            </div>
          </div>
          <Routes>
          <Route path="/products" element={<ProductList />}/>
            <Route path="/products/highestprice" element={<ProductList />}/>
            <Route path="/products/lowestprice" element={<ProductList />}/>
            <Route path="/products/highestscore" element={<ProductList />}/>
            <Route path="/products/lowestscore" element={<ProductList />}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
