import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-8 mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div>
          <h4 className="text-xl font-bold mb-4">About Us</h4>
          <p className="text-gray-300">
            We are dedicated to supporting farmers by providing access to the best resources, products, and government schemes. Our goal is to help improve agricultural practices and enhance the livelihood of farmers.
          </p>
        </div>
        
        <div>
          <h4 className="text-xl font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/" className="hover:underline text-orange-500">Home</a></li>
            <li><a href="/about" className="hover:underline text-orange-500">About Us</a></li>
            <li><a href="/products" className="hover:underline text-orange-500">Products</a></li>
            <li><a href="/schemes" className="hover:underline text-orange-500">Government Schemes</a></li>
            <li><a href="/contact" className="hover:underline text-orange-500">Contact Us</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-xl font-bold mb-4">Contact Us</h4>
          <p className="text-gray-300">Have questions? Reach out to us at:</p>
          <p className="text-gray-300">Email: <a href="mailto:info@agriculturewebsite.com" className="underline text-orange-400">info@agriculturewebsite.com</a></p>
          <p className="text-gray-300">Phone: +91 123 456 7890</p>
          <div className="mt-4">
            <h4 className="text-xl font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-gray-300 mt-8">
        <p>&copy; {new Date().getFullYear()} Khedut.com All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;