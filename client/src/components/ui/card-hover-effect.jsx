// src/components/ui/card-hover-effect.jsx
import React from 'react';

export function HoverEffect({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {items.map(({ title, description }, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-md p-6 cursor-pointer transform transition-transform hover:-translate-y-2 hover:shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-2 text-green-800">{title}</h3>
          <p className="text-gray-700">{description}</p>
        </div>
      ))}
    </div>
  );
}
