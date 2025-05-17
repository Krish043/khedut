import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SchemeContext } from "./SchemeContext";
import { toast } from "sonner";
const Apply = () => {
  const navigate = useNavigate();
  const { selectedSchemeId } = useContext(SchemeContext);
  const [currentStage, setCurrentStage] = useState(1);
  const [schemeData, setSchemeData] = useState([]);

  useEffect(() => {
    const fetchScheme = async () => {
      const scheme = await axios.get(
        `http://localhost:3000/schemes/${selectedSchemeId}`
      );
      setSchemeData(scheme.data);

    };
    fetchScheme();
  });
  const handleNextStage = () => {
    if (currentStage < 4) {
      setCurrentStage(currentStage + 1);
    }
  };

  const handlePreviousStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const handleApply = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("auth"));
      if (!user || !user.auth) {
        // alert('Please login first.');
        toast.error("please login first");
        navigate("/signin");
        return;
      }

      const mail = user.email;
      if (!mail) {
        toast.err("user is missing!");
        return;
      }
      console.log("Selected schemeId:", selectedSchemeId);

      const response = await axios.post("http://localhost:3000/apply", {
        mail,
        schemeId: selectedSchemeId,
      });

      toast.success("Applied for scheme:", response.data);
      navigate("/profile");
    } catch (err) {
      toast.error("Error applying for scheme:", err);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="w-full bg-white rounded-lg p-8 mb-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              {schemeData.name}
            </h2>
            <div className="p-4 bg-gray-100 rounded-md">
              <p className="text-gray-700 mt-2">{schemeData.description}</p>
              <p className="text-gray-800 mt-2">
                <strong>Amount:</strong> {schemeData.amount}
              </p>
              <p className="text-gray-800">
                <strong>Type:</strong> {schemeData.type}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center mb-8">
            {[1, 2, 3, 4].map((stage) => (
              <div
                key={stage}
                className={`flex-1 border-t-4 ${
                  currentStage === stage
                    ? "border-green-600"
                    : "border-gray-300"
                } p-2 text-center`}
              >
                <span
                  className={`text-sm ${
                    currentStage === stage
                      ? "text-green-600 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  Stage {stage}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            {currentStage === 1 && (
              <div>
                <label className="block mb-2 text-gray-700 font-bold">
                  Upload Aadhar Card
                </label>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleNextStage}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Next
                </button>
              </div>
            )}

            {currentStage === 2 && (
              <div>
                <label className="block mb-2 text-gray-700 font-bold">
                  Number of Family Members
                </label>
                <input
                  type="number"
                  className="w-full p-2 mb-4 border rounded bg-gray-200 text-black"
                />
                <label className="block mb-2 text-gray-700 font-bold">
                  Household Income
                </label>
                <input
                  type="number"
                  className="w-full p-2 mb-4 border rounded bg-gray-200 text-black"
                />
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handlePreviousStage}
                    className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStage}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentStage === 3 && (
              <div>
                <label className="block mb-2 text-gray-700 font-bold">
                  Upload Land Ownership Proof
                </label>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePreviousStage}
                    className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStage}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentStage === 4 && (
              <div>
                <label className="block mb-2 text-gray-700 font-bold">
                  Crops Grown
                </label>
                <input
                  type="text"
                  className="w-full p-2 mb-4 border rounded bg-gray-200 text-black"
                />
                <label className="block mb-2 text-gray-700 font-bold">
                  Farm Size (in acres)
                </label>
                <input
                  type="number"
                  className="w-full p-2 mb-4 border rounded bg-gray-200 text-black"
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePreviousStage}
                    className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;
