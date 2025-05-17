import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [product, setProduct] = useState({
    productname: '',
    quantity: '',
    price: '',
    description: '',
    uri: '',
    category: ''
  });
  const [currentStage, setCurrentStage] = useState(1);
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem('auth'));

  const stages = [
    { id: 1, label: 'Add Product Name' },
    { id: 2, label: 'Add Quantity & Price' },
    { id: 3, label: 'Add Description' },
    { id: 4, label: 'Add Image URL & Category' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStage = () => {
    if (currentStage < stages.length) {
      setCurrentStage(currentStage + 1);
    }
  };

  const handlePreviousStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const handleAddProduct = () => {
    if (Object.values(product).every((field) => field)) {
      axios.post('http://localhost:3000/products', {
        ...product,
        email: auth.email,
      })
        .then(() => {
          navigate('/sell');
        })
        .catch((error) => console.error('Error adding product!', error));
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-9">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Add a New Product</h2>
          <div className="flex justify-between items-center mb-8">
            {stages.map((stage) => (
              <div key={stage.id} className={`flex-1 border-t-4 ${currentStage === stage.id ? 'border-green-600' : 'border-gray-300'} p-2 text-center`}>
                <span className={`text-sm ${currentStage === stage.id ? 'text-green-600 font-bold' : 'text-gray-500'}`}>{stage.label}</span>
              </div>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(); }}>
            {currentStage === 1 && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productname">Product Name</label>
                <input
                  id="productname"
                  name="productname"
                  type="text"
                  value={product.productname}
                  onChange={handleInputChange}
                  className="bg-gray-50 border p-3 rounded mb-4 w-full"
                  required
                />
                <button type="button" onClick={handleNextStage} className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Next Stage</button>
              </div>
            )}
            {currentStage === 2 && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">Quantity (Kgs)</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={product.quantity}
                  onChange={handleInputChange}
                  className="bg-gray-50 border p-3 rounded mb-4 w-full"
                  required
                />
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price per Kg</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={product.price}
                  onChange={handleInputChange}
                  className="bg-gray-50 border p-3 rounded mb-4 w-full"
                  required
                />
                <div className="flex justify-between mt-4">
                  <button type="button" onClick={handlePreviousStage} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Previous Stage</button>
                  <button type="button" onClick={handleNextStage} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Next Stage</button>
                </div>
              </div>
            )}
            {currentStage === 3 && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  className="bg-gray-50 border p-3 rounded mb-4 w-full"
                  required
                />
                <div className="flex justify-between mt-4">
                  <button type="button" onClick={handlePreviousStage} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Previous Stage</button>
                  <button type="button" onClick={handleNextStage} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Next Stage</button>
                </div>
              </div>
            )}
            {currentStage === 4 && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="uri">Image URL</label>
                <input
                  id="uri"
                  name="uri"
                  type="text"
                  value={product.uri}
                  onChange={handleInputChange}
                  className="bg-gray-50 border p-3 rounded mb-4 w-full"
                  required
                />
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  className="bg-gray-50 border p-3 rounded mb-4 w-full"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Dairy Products">Dairy Products</option>
                </select>
                <div className="flex justify-between mt-4">
                  <button type="button" onClick={handlePreviousStage} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Previous Stage</button>
                  <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Product</button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
