import React, { useState, useEffect } from 'react';
import image1 from '../assets/image1.jpg'; // Replace with the actual path to your images
import image2 from '../assets/image2.jpg'; // Replace with the actual path to your images
import image3 from '../assets/image3.jpg'; // Replace with the actual path to your images
import image4 from '../assets/image4.jpg';
import image5 from '../assets/image5.jpg';
import Profile from './Profile';
const images = [
  {
    image: image1,
    title: "Buy & Sell Directly",
    description: "Connect directly with buyers and sellers in the agricultural market. Eliminate the middleman and maximize profits with Khedut.com’s marketplace.",
  },
  {
    image: image2,
    title: "Stay Ahead with Market News & Blogs",
    description: "Get the latest market trends, farming insights, and business tips through expert blogs and news updates. Keep your farming business informed and ready for changes.",
  },
  {
    image: image3,
    title: "Apply for Government Schemes & Grants",
    description: "Access and apply for government schemes and grants directly on Khedut.com. Secure financial support to boost your farming or business initiatives.",
  },
  {
    image: image4,
    title: "Learn with Our Interactive Modules",
    description: "Empower yourself with knowledge through our educational modules. Learn essential farming techniques, business strategies, and more to grow and succeed.",
  },
  {
    image: image5,
    title: "Chat with AI for Instant Solutions",
    description: "Get quick answers to your farming or business questions with Khedut.com's AI-powered chat assistant. Receive instant support whenever you need it.",
  },
];

const Home = () => {

  const localAuth = localStorage.getItem('auth');
  if(!localAuth) localStorage.setItem("auth",JSON.stringify({ name: '', email: '', auth: '', role: '' }));
  const auth = JSON.parse(localAuth);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <>
    { !auth.auth &&
      <div className="relative w-full h-screen overflow-hidden hidden md:block">
        <div
          className="absolute inset-0 flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((item, index) => (
            <div key={index} className="w-full h-screen flex-shrink-0 relative">
              <img
                src={item.image}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-center items-center text-center text-white px-4">
                <div className="max-w-3xl w-full text-center px-6">
                <h2 className="text-4xl font-bold mb-4 md:text-5xl">{item.title}</h2>
          <p className="text-lg md:text-xl">{item.description}</p>
        </div>
      </div>

            </div>
          ))}
        </div>
        <div className="absolute bottom-4 w-full flex justify-center space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full bg-white ${
                index === currentIndex ? "bg-black" : ""
              }`}
            ></div>
          ))}
        </div>
      </div>
    }

    {auth.auth && <Profile />}
          
    </>
  );
};

export default Home;
