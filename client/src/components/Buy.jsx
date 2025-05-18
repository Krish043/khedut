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
import { Star, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Buy = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [popup, setPopup] = useState({ show: false, id: "" });
  const [rating, setRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [users, setUsers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Change this value as per your requirement
  const [hoverRating, setHoverRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleClosePopup = () => {
    setPopup({ show: false, id: "" });
    setRating(0);
  };

  const categorizedProducts = products.reduce((categories, product) => {
    categories[product.category] = categories[product.category] || [];
    categories[product.category].push(product);
    return categories;
  }, {});

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === "All" ? "All Products" : category);
    setSearchTerm("");
    setCurrentPage(1); // Reset to first page when category changes
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by category first
    if (selectedCategory !== "All Products") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Then filter by search term if it exists
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.productname.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const filteredProducts = filterProducts();

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
      <div className="flex items-center justify-end p-2 h-[80px] w-full">
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
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-800 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products by name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-white border-green-300 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 shadow-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

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
              <button
                onClick={() => setPopup({ show: true, id: product._id })}
                className="w-full mt-2 py-2 text-sm font-semibold rounded-lg bg-yellow-200 text-yellow-700 border-yellow-600 hover:bg-yellow-300 transition"
              >
                Rate Product
              </button>
            </div>
          ))
        ) : (
          <p className="text-2xl text-gray-600 col-span-full text-center">
            {searchTerm
              ? "No products match your search."
              : "No products available."}
          </p>
        )}
      </div>

      {filteredProducts.length > 0 && (
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
      )}

      <h2 className="text-4xl font-bold text-green-800 text-center mt-16 mb-12">
        🥇 Our Top Products
      </h2>

      <div className="w-full max-w-4xl mx-auto space-y-6">
        {bestsellers.length > 0 ? (
          bestsellers
            .sort((a, b) => b.rating - a.rating)
            .map((seller, index) => {
              // Badge colors for top 3
              const badgeColors = [
                "bg-yellow-400 text-yellow-800", // Gold
                "bg-gray-300 text-gray-800", // Silver
                "bg-amber-700 text-white", // Bronze
              ];

              return (
                <Card
                  key={index}
                  className={cn(
                    "flex flex-col sm:flex-row items-center sm:justify-between px-6 py-4 shadow-sm hover:shadow-md transition rounded-xl border relative",
                    index === 0 && "bg-green-50 border-green-200"
                  )}
                >
                  {/* #1 Bestseller Label */}
                  {index === 0 && (
                    <div className="absolute -top-3 -left-3 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-tr-lg rounded-bl-lg shadow-md">
                      #1 Bestseller
                    </div>
                  )}

                  {/* Product Image */}
                  <img
                    src={seller.uri || "/default-product.png"}
                    alt={seller.productname}
                    className="w-24 h-24 rounded-lg object-cover mr-6"
                  />

                  {/* Left content: Badge and product info */}
                  <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
                    {/* Colored number badge for top 3, else default green */}
                    <div
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-full font-bold text-lg",
                        index < 3
                          ? badgeColors[index]
                          : "bg-green-100 text-green-800"
                      )}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-green-900">
                        {seller.productname}
                      </h3>
                      <p className="text-sm text-gray-500">
                        by @{users[seller.email] || seller.email.split("@")[0]}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < Math.round(seller.rating)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-semibold text-gray-800">
                          {seller.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <div className="mt-4 sm:mt-0 w-full sm:w-auto">
                    <button
                      onClick={() => addToCart(seller._id)}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-lg bg-green-200 text-green-700 border border-green-600 hover:bg-green-100 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </Card>
              );
            })
        ) : (
          <p className="text-center text-xl text-gray-600">
            No Top Products available.
          </p>
        )}
      </div>

      <Dialog open={popup.show} onOpenChange={handleClosePopup}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-green-700 text-2xl font-bold">
              Share Your Feedback
            </DialogTitle>
            <DialogDescription className="text-gray-700">
              How was your experience with this product?
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-2">
            <Label className="text-sm text-gray-700">
              Rate the Quality of the Product:
            </Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <Star
                  key={starValue}
                  size={28}
                  className={`cursor-pointer transition-colors ${
                    starValue <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(starValue)}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleClosePopup}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Submit Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Buy;
