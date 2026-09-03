'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Debounce backend query when user types
    const delayDebounceFn = setTimeout(() => {
      async function fetchProducts() {
        setLoading(true);
        try {
          const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          const queryParam = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
          
          const res = await fetch(`${API_BASE}/products${queryParam}`);
          if (!res.ok) throw new Error('Failed to fetch products');

          const response = await res.json();
          // Extract nested array correctly
          const productList = response?.data?.products || response?.products || [];
          setProducts(Array.isArray(productList) ? productList : []);
          setError('');
        } catch (err) {
          console.error('Error fetching products:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }

      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <section className="max-w-[1100px] mx-auto px-4 mt-8" id="products">
      <h2 className="text-center text-primary text-xl md:text-2xl font-extrabold mb-4">
        Our Pure Organic Products
      </h2>

      <div className="max-w-[480px] mx-auto mb-6 relative">
        <input
          type="text"
          placeholder="Search products (e.g. Talbina, Oats, Skincare)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2.5 pl-4 pr-10 border-2 border-gray-200 rounded-full text-sm outline-none focus:border-primary"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
      </div>

      {loading && (
        <div className="text-center py-12 text-gray-600 font-semibold animate-pulse">
          Loading Khaalis Products...
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500 font-medium">
          Failed to load products: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No products found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </section>
  );
}