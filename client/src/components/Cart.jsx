import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
const Cart = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("auth")) || {
    auth: false,
    email: "",
  };
  const [products, setProducts] = useState([]);
  const [prodDetails, setProdDetails] = useState([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    fetchProducts();
  }, [user.email]);

  const fetchProducts = async () => {
    try {
      if (!user.email) {
        toast.error("User not logged in or email missing");
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/cart/user/${user.email}`
      );
      const cartProds = response.data;
      if (!cartProds || cartProds.length === 0) {
        setProducts([]);
        setProdDetails([]);
        setTotal(0); // Set total to 0 explicitly if cart empty
        return;
      }

      setProducts(cartProds);
      setProdDetails(cartProds); // You can also format for UI if needed

      const totalPrice = cartProds.reduce(
        (acc, item) =>
          acc + (parseFloat(item.price) * (item.totalQuantity || 1) || 0),
        0
      );

      setTotal(Number(totalPrice)); // Ensure total is number
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load cart items.");
    }
  };

  const handleAddToCart = async (prodId) => {
    try {
      const response = await axios.post("http://localhost:3000/cart/", {
        mail: user.email,
        prodId: prodId,
      });
      console.log("Added to cart:", response.data);
      toast.success("Added to cart!");
      fetchProducts(); // Refresh cart
    } catch (error) {
      console.error("Error add product:", error);
      toast.error("Failed to add item.");
    }
  };

  const handleRemoveFromCart = async (prodId) => {
    try {
      const response = await axios.post("http://localhost:3000/cart/remove", {
        mail: user.email,
        prodId: prodId,
      });

      console.log("Removed from cart:", response.data);
      toast.success("Removed from cart!");
      fetchProducts(); // Refresh cart
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error("Failed to remove item.");
    }
  };

  const makePayment = async () => {
    try {
      const stripe = await loadStripe(
        "pk_test_51QeJCvPKjQlfcKogplYtkNh3soRVcGkkHZtmKgBE9fgRqnaNyqFaY1AhgRPtX7UKztfhJ8AS7qQkNb4I7jU7HnI100BLsSuXNP"
      );

      const body = {
        products: products,
      };
      const headers = { "Content-Type": "application/json" };

      const response = await fetch(
        `http://localhost:3000/cart/create-checkout-session`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        }
      );

      const session = await response.json();

      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      toast.success("Payment successful");
      if (result.error) {
        console.log(result.error.message);
        toast.error("Stripe redirect failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Try again later.");
    }
  };

  return (
    // <div className="container mx-auto px-4 py-16 mt-4">
    //   <h1 className="text-4xl font-extrabold text-green-900 mb-10 text-center">
    //     Your Cart 🛒
    //   </h1>

    //   {prodDetails.length === 0 ? (
    //     <div className="text-center text-green-800 text-lg mt-20">
    //       <p className="mb-4">Your cart is empty 🌿</p>
    //       <Button
    //         className="bg-green-600 hover:bg-green-700 text-white"
    //         onClick={() => navigate("/buy")}
    //       >
    //         Browse Products
    //       </Button>
    //     </div>
    //   ) : (
    //     <>
    //       <div className="flex flex-wrap justify-center gap-6">
    //         {prodDetails.map((product, index) => (
    //           <Card
    //             key={index}
    //             className="w-[280px] rounded-xl overflow-hidden shadow-md transition-transform hover:scale-[1.03] border border-green-200 bg-white"
    //           >
    //             <img
    //               src={product.uri}
    //               alt={product.productname}
    //               className="w-full h-44 object-cover"
    //             />
    //             <CardContent className="p-4 space-y-2">
    //               <CardTitle className="text-green-800 text-lg font-semibold">
    //                 {product.productname}
    //               </CardTitle>
    //               <div className="text-gray-700 text-sm">
    //                 <span className="font-medium">Price:</span> ₹{product.price}
    //                 /kg
    //               </div>
    //               <div className="text-sm text-gray-600">
    //                 <span className="font-medium">Quantity:</span>{" "}
    //                 {product.totalQuantity} kg
    //               </div>
    //               <div className="text-gray-700 text-sm">
    //                 <span className="font-medium">Pack of: </span>
    //                 {product.totalQuantity/product.count} kg
    //               </div>

    //               <div className="text-gray-700 text-sm">
    //                 <span className="font-medium">Amount:</span> ₹
    //                 {product.price * product.totalQuantity}
    //               </div>

    //               <div className="text-yellow-600 text-sm">
    //                 <span className="font-medium">Rating:</span> ⭐{" "}
    //                 {product.rating}
    //               </div>

    //               <Button
    //                 size="sm"
    //                 variant="destructive"
    //                 className="w-full mt-3"
    //                 onClick={() => handleRemoveFromCart(product._id)}
    //               >
    //                 Remove 1 pack
    //               </Button>
    //             </CardContent>
    //           </Card>
    //         ))}
    //       </div>

    //       <Separator className="my-10" />

    //       <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
    //         <p className="text-xl font-bold text-green-900">
    //           Total Amount:{" "}
    //           <span className="text-black font-semibold">
    //             ₹{total.toFixed(2)}
    //           </span>
    //         </p>
    //         <Button
    //           onClick={makePayment}
    //           className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 text-base"
    //         >
    //           Proceed to Checkout
    //         </Button>
    //       </div>
    //     </>
    //   )}
    // </div>
    <div className="mt-8 max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-900 mb-8 text-center">
        Your Cart 🛒
      </h1>

      {prodDetails.length === 0 ? (
        <div className="text-center text-green-800 text-lg mt-20">
          <p className="mb-4">Your cart is empty 🌿</p>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => navigate("/buy")}
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {prodDetails.map((product, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 bg-white border border-green-100 shadow-sm rounded-xl p-4 hover:shadow-md transition"
              >
                {/* Image */}
                <img
                  src={product.uri}
                  alt={product.productname}
                  className="w-full sm:w-32 h-32 object-cover rounded-md border mx-auto"
                />

                {/* Product Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between flex-wrap">
                    <h2 className="text-lg font-semibold text-green-900">
                      {product.productname}
                    </h2>
                    <span className="text-sm text-muted-foreground font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-[2px]">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill={
                            product.rating >= i + 1
                              ? "#facc15" // full star
                              : product.rating > i
                              ? "url(#half)" // half star
                              : "#e5e7eb" // empty star
                          }
                          viewBox="0 0 24 24"
                          stroke="none"
                        >
                          <defs>
                            <linearGradient id="half">
                              <stop offset="50%" stopColor="#facc15" />
                              <stop offset="50%" stopColor="#e5e7eb" />
                            </linearGradient>
                          </defs>
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.832 1.5 8.291L12 18.896l-7.436 4.533 1.5-8.291L0 9.306l8.332-1.151z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>  

                  {/* Description */}
                  <p className="text-sm text-gray-600">{product.description}</p>

                  {/* Info Grid */}
                  {/* Info Grid (Left-Aligned Two Columns) */}
                  <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm text-muted-foreground">
                    <div className="space-y-1">
                      <p>
                        <span className="font-medium text-black">Price:</span> ₹
                        {product.price}/kg
                      </p>
                      <p>
                        <span className="font-medium text-black">
                          Quantity:
                        </span>{" "}
                        {product.totalQuantity} kg
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p>
                        <span className="font-medium text-black">Pack of:</span>{" "}
                        {product.totalQuantity / product.count} kg
                      </p>
                      <p>
                        <span className="font-medium text-black">Amount:</span>{" "}
                        ₹{product.price * product.totalQuantity}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 min-w-[120px] justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-700 border-green-600 hover:bg-green-100"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    Add 1 Pack
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-700 border-red-600 hover:bg-red-100"
                    onClick={() => handleRemoveFromCart(product._id)}
                  >
                    Remove 1 Pack
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-lg font-bold text-green-900">
              Total Amount:{" "}
              <span className="text-black font-semibold">
                ₹{total.toFixed(2)}
              </span>
            </p>
            <Button
              onClick={makePayment}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 text-base"
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
