import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Rating () {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [popup, setPopup] = useState({ show: false, email: "", id: "" });
  const [rating, setRating] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/checkout-session/${sessionId}`
        );
        // Assuming backend returns session data with customer email and id
        const sessionData = response.data;
        setPopup({ show: true, email: sessionData.customer_email, id: sessionData.id });
      } catch (error) {
        console.error("Failed to fetch session data", error);
        // maybe redirect or show error
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleSubmitRating = () => {
    axios
      .post("http://localhost:3000/ratings", {
        id: popup.id,
        rating,
      })
      .then(() => {
        alert("Thank you for your rating!");
        handleClosePopup();
      })
      .catch((error) => {
        console.error("Error submitting rating:", error);
        alert("Failed to submit rating. Please try again.");
      });
  };

  const handleClosePopup = () => {
    setPopup({ ...popup, show: false });
    navigate("/"); // Redirect to homepage or wherever you want
  };

  return (
    <>
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
              disabled={!rating}
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
    </>
  );
};
