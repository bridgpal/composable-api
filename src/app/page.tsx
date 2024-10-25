import Image from "next/image";
import Navigation from "@/components/Navigation";
import ProductList from "@/components/ProductList";
import { Suspense } from "react";
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
        <Suspense fallback={<div>Loading...</div>}>
          <ProductList />
        </Suspense>
      </div>
    </div>
  );
}
