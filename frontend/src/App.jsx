import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home"; // The file we just created
import AdminDashboard from "./pages/AdminDashboard"; // The file we just created
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Login />} />

                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;