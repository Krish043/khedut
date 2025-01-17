import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {loadStripe} from '@stripe/stripe-js'
const Buy = () => {
  const [products, setProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [popup, setPopup] = useState({ show: false, id: '' });
  const [rating, setRating] = useState(0); // Set rating as a number

  const makePayment = async () => {
    const stripe = await loadStripe("")

  }
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products');
        setProducts(response.data);
        // console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchBestsellers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/bestsellers');
        setBestsellers(response.data);
      } catch (error) {
        console.error('Error fetching bestsellers:', error);
      }
    };

    fetchProducts();
    fetchBestsellers();
  }, [rating]); // Empty dependency array since no need to re-fetch on every render

  const handleBuyNow = (id) => {
    setPopup({ show: true, id: id });
  };

  const handleClosePopup = () => {
    setPopup({ show: false, id: '' });
    setRating(0); // Reset rating when closing the popup
  };

  const handleSubmitRating = () => {
    axios.post('http://localhost:3000/ratings', {
      id: popup.id,
      rating: rating,
    })
      .then(response => {
        console.log('Rating submitted:', response.data);
        handleClosePopup(); // Close the popup after submission
      })
      .catch(error => {
        console.error('Error submitting rating:', error);
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8 mt-12 w-[100vw]">
      <h2 className="text-4xl font-bold mb-10 text-green-800">Available Products</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-screen-lg">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={product._id}
              className="p-2 pb-0 w-100 bg-white rounded-lg shadow-lg text-left transform transition-transform hover:scale-105 hover:shadow-2xl">
              <div className="relative mb-2">
                <img
                  src={product.uri}
                  alt={product.productname}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black opacity-30 rounded-t-lg"></div>
              </div>
              <div className="relative z-10 p-3 pb-2">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{product.productname}</h3>
                <p className="text-gray-500 mb-2 text-truncate fw-bold ps-3">by @{product.email}</p>
                <p className="text-gray-600 mb-2 h-[75px] line-clamp-3">about: {product.description}</p>
                <p className="text-gray-600">rating: {product.rating.toFixed(1)}</p>
                <p className="text-lg font-semibold text-gray-800">Quantity: {product.quantity} <span className='font-thin text-base'>Kgs</span></p>
                <p className="text-lg font-semibold text-gray-800">Price: {product.price} <span className='font-thin text-base'>Rs/Kg</span></p>
                <button
                  onClick={() => handleBuyNow(product._id)}
                  className="mt-0 mb-2 py-2 px-4 bg-green-500 text-white rounded-lg shadow-lg font-semibold transform transition hover:bg-green-600 hover:scale-105">
                  Buy Now
                </button>
                <button
                  onClick={makePayment}
                  className="mt-0 mb-2 py-2 px-4 bg-green-500 text-white rounded-lg shadow-lg font-semibold transform transition hover:bg-green-600 hover:scale-105">
                  Pay with Stripe
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-2xl text-gray-600">No products available.</p>
        )}
      </div>

      <h2 className="text-4xl font-bold mb-10 text-green-800 mt-12">Our Top Products</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-screen-lg">
        {bestsellers.length > 0 ? (
          bestsellers.map((seller, index) => (
            <div key={index} className="p-6 pb-2 bg-white rounded-lg shadow-lg text-left fw-bolder">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3 text-center">{seller.email}</h3>
              <p className="text-gray-600 fw-bold">product: {seller.productname}</p>
              <p className="text-gray-600 fw-bold">avg. Rating: {seller.rating.toFixed(1)}</p>
            </div>
          ))
        ) : (
          <p className="text-2xl text-gray-600">No Top Products available.</p>
        )}
      </div>

      {popup.show && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-green-800">Thank You!</h3>
            <p className="text-lg text-gray-800">Thanks for buying from {popup.email}!</p>
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Rate the Seller (1-5 stars):</label>
              <select
                value={rating}
                required
                onChange={(e) => setRating(Number(e.target.value))}
                className="border p-2 bg-white rounded w-full"
              >
                <option value="" disabled>Select a rating</option>
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
              className="mt-4 py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg font-semibold transform transition hover:bg-red-600 hover:scale-105"
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
