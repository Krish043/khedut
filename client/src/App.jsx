import "./App.css";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Footer from "./components/Footer";
import Home from "./components/Home";
import { SchemeProvider } from "./components/SchemeContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { CartProvider } from "./components/CartContext";
import Schemes from "./components/Schemes";
import Apply from "./components/Apply";
import Sell from "./components/sell";
import Buy from "./components/Buy";
import Learn from "./components/learn";
import Chat from "./components/Chat";
import Profile from "./components/Profile";
import BlogDetail from "./components/BlogDetail";
import AddBlog from "./components/AddBlog";
import Blogs from "./components/Blogs";
import AddProduct from "./components/AddProduct";
import Cart from "./components/Cart";
import Rating from "./components/Rating";
function App() {
  // const auth=JSON.parse(localStorage.getItem("auth"));
  // {console.log(auth.name);}
  // const user = localStorage.getItem("token");
  // localStorage.setItem("auth",JSON.stringify({auth:false}))
  const [isAuth, setIsAuth] = useState({
    name: "",
    email: "",
    role: "",
    auth: false,
  });
  // if(auth) setIsAuth(auth)
  const localAuth = localStorage.getItem("auth");
  if (!localAuth)
    localStorage.setItem(
      "auth",
      JSON.stringify({ name: "", email: "", auth: "", role: "" })
    );
  const auth = JSON.parse(localAuth);

  // const auth = JSON.parse(localStorage.getItem('auth'));

  return (
    <>
      <BrowserRouter>
        <SchemeProvider>
          <CartProvider>
          <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/blogs" element={<Blogs />}></Route>
            <Route path="/signin" element={<Signin />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/schemes" element={<Schemes />}></Route>
            <Route path="/add-scheme" element={<Apply />}></Route>
            <Route path="/learn" element={<Learn />}></Route>
            <Route path="/rate" element={<Rating />}></Route>
            

            {auth.auth && auth.role === "farmer" && (
              <Route path="/sell" element={<Sell />}></Route>
            )}
            {auth.auth && auth.role === "businessman" && (
              <Route path="/buy" element={<Buy />}></Route>
            )}
            {auth.auth && (
              <Route path="/profile" element={<Profile />}></Route>
            )}
            {auth.auth && auth.role === "businessman" && (
              <Route path="/cart" element={<Cart />}></Route>
            )}

            <Route path="/chat" element={<Chat />}></Route>
            <Route path="/sell" element={<Navigate replace to="/signin" />} />
            <Route path="/buy" element={<Navigate replace to="/signin" />} />
            <Route path="/:id" element={<BlogDetail />} />
            <Route path="/add-blog" element={<AddBlog />} />
            <Route path="/add-product" element={<AddProduct />} />
          
          </Routes>
          <Footer />
          </CartProvider>
        </SchemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
