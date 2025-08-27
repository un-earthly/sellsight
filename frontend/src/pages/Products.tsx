import React, { useState, useEffect } from 'react';
import ProductTable from '../components/ProductTable';
import { fetchProducts } from '../api/products';

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  sales: number;
  rating: number;
  lastUpdate: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="mt-2 text-gray-600">
          Browse and analyze all scraped products with advanced filtering and sorting
        </p>
      </div>

      <ProductTable products={products} />
    </div>
  );
};

export default Products;