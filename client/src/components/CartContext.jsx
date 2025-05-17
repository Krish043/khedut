// import React, { createContext, useState } from 'react';

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   // This function updates the cart items in the context
//   const updateCartItems = (newItem) => {
//     setCartItems(newItem);
//   };

//   return (
//     <CartContext.Provider value={{ cartItems, updateCartItems }}>
//       {children}
//     </CartContext.Provider>
//   );
// };



import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(null);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
