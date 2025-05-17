import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Sell = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState({});
  const [auth, setAuth] = useState({
    name: "",
    email: "",
    auth: false,
    role: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    const localAuth = localStorage.getItem("auth");
    if (!localAuth) {
      const defaultAuth = { name: "", email: "", auth: false, role: "" };
      localStorage.setItem("auth", JSON.stringify(defaultAuth));
      setAuth(defaultAuth);
    } else {
      setAuth(JSON.parse(localAuth));
    }
  }, []); 

  const fetchProducts = () => {
    axios
      .get("http://localhost:3000/products")
      .then((response) => {
        setProducts(response.data);
        fetchUserDetails(response.data);
      })
      .catch((error) => console.error("Error fetching products!", error));
  };

  const fetchUserDetails = (products) => {
    const userPromises = products.map(product => 
      axios.get(`http://localhost:3000/users/${product.email}`)
    );
    Promise.all(userPromises)
      .then(responses => {
        const usersMap = {};
        responses.forEach(response => {
          const { email, name } = response.data;
          usersMap[email] = name;
        });
        setUsers(usersMap);
      })
      .catch(error => console.error("Error fetching user details!", error));
  };

  const categorizedProducts = products.reduce((categories, product) => {
    categories[product.category] = categories[product.category] || [];
    categories[product.category].push(product);
    return categories;
  }, {});

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === "All" ? "All Products" : category);
  };

  const filteredProducts =
    selectedCategory === "All Products"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8 mt-12 w-full">
      <DropdownMenu onOpenChange={setIsDropdownOpen}>
        <div className="flex w-full p-2 h-[80px] items-center justify-between">
          <DropdownMenuTrigger className="flex items-center text-4xl font-bold text-green-800 cursor-pointer">
            {selectedCategory}
            {isDropdownOpen ? (
              <FaChevronUp className="ml-2" />
            ) : (
              <FaChevronDown className="ml-2" />
            )}
          </DropdownMenuTrigger>
          <button
            onClick={() => {
              navigate("/add-product");
            }}
            className="py-3 w-[150px] bg-green-500 text-white rounded-lg shadow-lg"
          >
            Add products
          </button>
        </div>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleCategoryClick("All")}>
            All Products
          </DropdownMenuItem>
          {Object.keys(categorizedProducts).map((category) => (
            <DropdownMenuItem
              key={category}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-screen-lg">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="p-2 pb-0 bg-white rounded-lg shadow-lg text-left"
          >
            <img
              src={product.uri}
              alt={product.productname}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h4 className="text-3xl font-bold text-gray-800 mb-2">
              {product.productname}
            </h4>
            <p className="text-gray-500 mb-2">by @{users[product.email] || "Unknown"}</p>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-semibold text-gray-800">
              Quantity: {product.quantity} Kgs
            </p>
            <p className="text-lg font-semibold text-gray-800">
              Price: {product.price} Rs/Kg
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sell;
