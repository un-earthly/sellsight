// Mock data for demonstration - replace with actual API calls
export const fetchProducts = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock products data
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Toys'];
  
  const mockProducts = Array.from({ length: 50 }, (_, i) => ({
    id: `product-${i + 1}`,
    title: `Product ${i + 1} - ${['Premium', 'Professional', 'Essential', 'Deluxe', 'Standard'][Math.floor(Math.random() * 5)]} ${['Widget', 'Gadget', 'Tool', 'Device', 'Accessory'][Math.floor(Math.random() * 5)]}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    price: Math.round((Math.random() * 200 + 10) * 100) / 100,
    sales: Math.floor(Math.random() * 10000 + 100),
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    lastUpdate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 2).toISOString(),
  }));

  return mockProducts;
};

// Uncomment and modify this for actual API integration:
/*
export const fetchProducts = async () => {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
*/