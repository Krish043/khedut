// import React from 'react';

// const Footer = () => {
//   return (
//     <footer className="bg-green-800 text-white py-8 mt-12">
//       <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
//         <div>
//           <h4 className="text-xl font-bold mb-4">About Us</h4>
//           <p className="text-gray-300">
//             We are dedicated to supporting farmers by providing access to the best resources, products, and government schemes. Our goal is to help improve agricultural practices and enhance the livelihood of farmers.
//           </p>
//         </div>
        
//         <div>
//           <h4 className="text-xl font-bold mb-4">Quick Links</h4>
//           <ul className="space-y-2">
//             <li><a href="/" className="hover:underline text-orange-500">Home</a></li>
//             <li><a href="/about" className="hover:underline text-orange-500">About Us</a></li>
//             <li><a href="/products" className="hover:underline text-orange-500">Products</a></li>
//             <li><a href="/schemes" className="hover:underline text-orange-500">Government Schemes</a></li>
//             <li><a href="/contact" className="hover:underline text-orange-500">Contact Us</a></li>
//           </ul>
//         </div>
        
//         <div>
//           <h4 className="text-xl font-bold mb-4">Contact Us</h4>
//           <p className="text-gray-300">Have questions? Reach out to us at:</p>
//           <p className="text-gray-300">Email: <a href="mailto:info@agriculturewebsite.com" className="underline text-orange-400">info@agriculturewebsite.com</a></p>
//           <p className="text-gray-300">Phone: +91 123 456 7890</p>
//           <div className="mt-4">
//             <h4 className="text-xl font-bold mb-4">Follow Us</h4>
//             <div className="flex space-x-4">
//               <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-facebook-f"></i></a>
//               <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-twitter"></i></a>
//               <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-instagram"></i></a>
//               <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-linkedin-in"></i></a>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="text-center text-gray-300 mt-8">
//         <p>&copy; {new Date().getFullYear()} Khedut.com All Rights Reserved.</p>
//       </div>
//     </footer>
//   );
// }

// export default Footer;


import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const Footer = ({ isLoading = false }) => {
  if (isLoading) {
    return (
      <footer className="bg-gray-100 py-8 mt-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="container mx-auto mt-8">
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-b from-green-700 to-green-800 text-white py-8 mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* About Section */}
        <div>
          <h4 className="text-xl font-bold mb-4 text-green-100">About Us</h4>
          <p className="text-green-50">
            We are dedicated to supporting farmers by providing access to the best resources, 
            products, and government schemes. Our goal is to help improve agricultural 
            practices and enhance the livelihood of farmers.
          </p>
        </div>
        
        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-bold mb-4 text-green-100">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { name: "Home", path: "/" },
              { name: "About Us", path: "/about" },
              { name: "Products", path: "/products" },
              { name: "Government Schemes", path: "/schemes" },
              { name: "Contact Us", path: "/contact" }
            ].map((link) => (
              <li key={link.name}>
                <a 
                  href={link.path} 
                  className="hover:underline text-green-50 hover:text-green-200 transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Contact Section */}
        <div>
          <h4 className="text-xl font-bold mb-4 text-green-100">Contact Us</h4>
          <div className="space-y-2 text-green-50">
            <p>Have questions? Reach out to us at:</p>
            <p>
              Email: <a 
                href="mailto:info@agriculturewebsite.com" 
                className="underline hover:text-green-200 transition-colors text-green-50"
              >
                info@agriculturewebsite.com
              </a>
            </p>
            <p>Phone: +91 123 456 7890</p>
          </div>
          
          <div className="mt-6">
            <h4 className="text-xl font-bold mb-4 text-green-100">Follow Us</h4>
            <div className="flex space-x-4">
              {[
                { icon: "facebook-f", url: "#" },
                { icon: "twitter", url: "#" },
                { icon: "instagram", url: "#" },
                { icon: "linkedin-in", url: "#" }
              ].map((social) => (
                <a 
                  key={social.icon}
                  href={social.url} 
                  className="text-green-50 hover:text-green-200 transition-colors text-lg"
                  aria-label={social.icon}
                >
                  <i className={`fab fa-${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="text-center text-green-100 mt-8 pt-4 border-t border-green-600">
        <p>&copy; {new Date().getFullYear()} Khedut.com All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;