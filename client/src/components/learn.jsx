import React from 'react';

const learn = () => {
  const topics = [
    { title: "Soil Preparation", description: "Learn how to prepare soil for optimal crop growth." },
    { title: "Irrigation Techniques", description: "Discover various irrigation methods for efficient water use." },
    { title: "Pest Control", description: "Understand how to manage pests and protect your crops." },
    { title: "Crop Rotation", description: "Learn the benefits of rotating crops to maintain soil health." },
    { title: "Organic Farming", description: "Explore the practices of organic farming and its advantages." },
    { title: "Harvesting Methods", description: "Get to know the best harvesting techniques for different crops." },
    { title: "Farm Equipment", description: "Understand the types of equipment used in modern farming." },
    { title: "Agricultural Economics", description: "Learn about the economic aspects of agriculture." },
  ];

  return (
    <div className="p-8 mt-12">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-6">Learn About Agriculture</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {topics.map((topic, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden p-4 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-2">{topic.title}</h2>
            <p className="text-gray-700">{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default learn;
