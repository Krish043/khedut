import React from 'react';

const Card = ({ name, image, description, type, amount, onApply }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
    <div className="relative h-48">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
      />
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-semibold text-green-800 mb-2">{name}</h3>
      {type && <p className="text-green-600 mb-1">Type: {type}</p>}
      {amount && <p className="text-green-600 mb-2">Amount: {amount}</p>}
      <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
      <button
        onClick={onApply}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300 ease-in-out transform hover:scale-105"
      >
        Apply Now
      </button>
    </div>
  </div>
);

export default Card;
    