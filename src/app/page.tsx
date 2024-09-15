import { use } from 'react';
import Image from "next/image";

import { Suspense } from 'react';

import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';




async function getProducts(): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';
  const response = await fetch(`${baseUrl}/.netlify/functions/contentstack`, { 
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
}

function ProductList() {
  const products = use(getProducts());

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

const HipEcommercePage = () => {
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
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductList />
        </Suspense>
      </div>
    </div>
  );
};

export default HipEcommercePage;
