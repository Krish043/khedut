import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import pagination components
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
const Buy = () => {
  const [products, setProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [popup, setPopup] = useState({ show: false, id: "" });
  const [rating, setRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [users, setUsers] = useState({});
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Change this value as per your requirement

  const addToCart = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem("auth"));
      if (!user || !user.auth) {
        toast.error("Please login first.");
        navigate("/signin");
        return;
      }

      const mail = user.email;
      if (!mail) {
        toast.error("User email missing!");
        return;
      }

      const response = await axios.post("http://localhost:3000/cart", {
        mail,
        prodId: productId,
      });

      console.log("Added to cart:", response.data);
      toast.success("Product added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart.");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        setProducts(response.data);
        fetchUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchBestsellers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/bestsellers");
        setBestsellers(response.data);
      } catch (error) {
        console.error("Error fetching bestsellers:", error);
      }
    };

    fetchProducts();
    fetchBestsellers();
  }, [rating]);

  useEffect(() => {
    if (bestsellers.length > 0) {
      fetchUserDetails(bestsellers);
    }
  }, [bestsellers]);

  const fetchUserDetails = (products) => {
    const userPromises = products.map((product) =>
      axios.get(`http://localhost:3000/users/email/${product.email}`)
    );
    Promise.all(userPromises)
      .then((responses) => {
        const usersMap = {};
        responses.forEach((response) => {
          const { email, name } = response.data;
          usersMap[email] = name;
        });
        setUsers(usersMap);
      })
      .catch((error) => console.error("Error fetching user details!", error));
  };

  const handleSubmitRating = () => {
    axios
      .post("http://localhost:3000/ratings", {
        id: popup.id,
        rating,
      })
      .then((response) => {
        console.log("Rating submitted:", response.data);
        handleClosePopup();
      })
      .catch((error) => {
        console.error("Error submitting rating:", error);
      });
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

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8 mt-12 w-[100vw]">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product._id}
              className="rounded-2xl border bg-white p-4 shadow-md hover:shadow-lg hover:scale-[1.01] transition-transform"
            >
              <div className="relative">
                <img
                  src={product.uri}
                  alt={product.productname}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {product.category || "Uncategorized"}
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {product.productname}
                </h3>
                <p className="text-sm text-gray-500">
                  by @{users[product.email]}
                </p>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : i < product.rating
                          ? "text-yellow-300"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.563-.954L10 0l2.947 5.956 6.563.954-4.755 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    {product.rating.toFixed(1)}
                  </span>
                </div>

                <div className="text-sm mt-1 text-gray-700">
                  Pack of: <strong>{product.quantity} kg</strong>
                </div>
                <div className="text-sm text-gray-700">
                  Price: <strong>₹{product.price}/kg</strong>
                </div>
              </div>

              <button
                onClick={() => addToCart(product._id)}
                className="w-full mt-4 py-2 text-sm font-semibold rounded-lg bg-green-200 text-green-700 border-green-600 hover:bg-green-100 transition"
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="text-2xl text-gray-600 col-span-full text-center">
            No products available.
          </p>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationPrevious
            className="text-slate-600 hover:cursor-pointer"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </PaginationPrevious>
          <PaginationContent>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  className={
                    currentPage === index + 1
                      ? "bg-green-500 text-white"
                      : "hover:cursor-pointer"
                  }
                  onClick={() => paginate(index + 1)}
                  active={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
          <PaginationNext
            className="text-slate-600 hover:cursor-pointer"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PaginationNext>
        </Pagination>
      </div>

      <h2 className="text-4xl font-bold text-green-800 text-center mt-16 mb-12">
        🥇 Our Top Products
      </h2>

      <div className="w-full max-w-4xl mx-auto space-y-6">
        {bestsellers.length > 0 ? (
          bestsellers
            .sort((a, b) => b.rating - a.rating)
            .map((seller, index) => (
              <Card
                key={index}
                className={cn(
                  "flex items-center justify-between px-6 py-4 shadow-sm hover:shadow-md transition rounded-xl border",
                  index === 0 && "bg-green-50 border-green-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="bg-green-100 text-green-800">
                    <AvatarFallback>{index + 1}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">
                      {seller.productname}
                    </h3>
                    <p className="text-sm text-gray-500">
                      by @{users[seller.email] || seller.email.split("@")[0]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-gray-800">
                    {seller.rating.toFixed(1)}
                  </span>
                </div>
              </Card>
            ))
        ) : (
          <p className="text-center text-xl text-gray-600">
            No Top Products available.
          </p>
        )}
      </div>

      {popup.show && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-green-800">
              Thank You!
            </h3>
            <p className="text-lg text-gray-800">
              Thanks for buying from {popup.email}!
            </p>
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">
                Rate the Seller (1-5 stars):
              </label>
              <select
                value={rating}
                required
                onChange={(e) => setRating(Number(e.target.value))}
                className="border p-2 bg-white rounded w-full"
              >
                <option value="" disabled>
                  Select a rating
                </option>
                <option value={1}>1 - Very Poor</option>
                <option value={2}>2 - Poor</option>
                <option value={3}>3 - Average</option>
                <option value={4}>4 - Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </div>
            <button
              onClick={handleSubmitRating}
              className="mt-4 py-2 px-4 bg-green-500 text-white rounded-lg shadow-lg font-semibold transform transition hover:bg-green-600 hover:scale-105"
            >
              Submit Rating
            </button>
            <button
              onClick={handleClosePopup}
              className="mt-4 py-2 px-4 bg-gray-500 text-white rounded-lg shadow-lg font-semibold transform transition hover:bg-gray-600 hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buy;
