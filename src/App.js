import './App.css';
import Home from './pages/Home';
import Customer from './pages/customer/Customer';
import Product from './pages/product/Product';
import Sale from './pages/sale/Sale';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidenav from './pages/components/Sidenav';

function App() {
  return (
    <BrowserRouter>
        <Sidenav >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/product" element={<Product />} />
              <Route path="/sale" element={<Sale />} />
            </Routes>
        </Sidenav>
    </BrowserRouter>
  );
}

export default App;
