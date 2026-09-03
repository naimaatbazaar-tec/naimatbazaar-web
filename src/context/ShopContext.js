'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved =
        localStorage.getItem('cart') ||
        localStorage.getItem('cartItems') ||
        localStorage.getItem('nb_cart');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse cart:', e);
        }
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeBlogProduct, setActiveBlogProduct] = useState(null);

  // Sync to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
      localStorage.setItem('cartItems', JSON.stringify(cart));
      localStorage.setItem('nb_cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Updated addToCart accepts product object or productId string
  const addToCart = (productOrTitle, grammage, price, qty = 1) => {
    setCart((prevCart) => {
      let productId = null;
      let title = '';

      if (typeof productOrTitle === 'object' && productOrTitle !== null) {
        productId = productOrTitle._id || productOrTitle.id;
        title = productOrTitle.title || productOrTitle.name;
      } else {
        title = productOrTitle;
      }

      const existingIdx = prevCart.findIndex((item) => {
        const itemProdId = item.product?._id || item.product || item._id;
        if (productId && itemProdId) {
          return itemProdId === productId && item.grammage === grammage;
        }
        return item.title === title && item.grammage === grammage;
      });

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].qty += qty;
        return updated;
      }

      return [
        ...prevCart,
        {
          _id: productId,
          product: productId,
          title,
          grammage,
          price: Number(price),
          qty: Number(qty),
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateQty = (identifier, newQtyOrChange) => {
    setCart((prevCart) => {
      return prevCart
        .map((item, idx) => {
          const itemKey = item.product?._id
            ? `${item.product._id}-${item.grammage || idx}`
            : item._id || idx;

          const matches = identifier === idx || identifier === itemKey;

          if (matches) {
            const updatedQty =
              typeof newQtyOrChange === 'number' &&
              Math.abs(newQtyOrChange) === 1 &&
              newQtyOrChange <= 1 &&
              newQtyOrChange >= -1
                ? item.qty + newQtyOrChange
                : newQtyOrChange;

            return { ...item, qty: updatedQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
      localStorage.removeItem('cartItems');
      localStorage.removeItem('nb_cart');
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price || 0) * item.qty, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQty,
        clearCart,
        subtotal,
        totalCartCount,
        openBlog: (product) => setActiveBlogProduct(product),
        activeBlogProduct,
        closeBlog: () => setActiveBlogProduct(null),
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}