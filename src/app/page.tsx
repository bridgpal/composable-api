import Image from "next/image";
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';

async function getProducts() {
  const baseUrl = process.env.URL || 'http://localhost:8888';
  console.log('Base URL:', baseUrl); // Log the base URL
  const response = await fetch(`${baseUrl}/.netlify/functions/contentstack`, { 
    cache: 'no-store',
  });
  
  console.log('Response status:', response.status); // Log the response status

  if (!response.ok) {
    const errorText = await response.text(); // Get error text for more details
    console.error('Fetch error:', errorText); // Log the error text
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
}

async function ProductList() {
  const products = await getProducts()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default async function HipEcommercePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Trending Now
        </h1>
        <p className="text-gray-600 mb-8">
          Discover our curated collection of sustainable fashion
        </p>
        <ProductList />
      </div>
    </div>
  );
}
