import ProductCard from "@/components/ProductCard";

async function getProducts() {
  console.log("URL", process.env.URL)
  console.log("Deploy URL", process.env.DEPLOY_URL)
  console.log("Deploy PRIME URL", process.env.NEXT_PUBLIC_API_BASE)
console.log("ALL ENV", process.env)

  console.log("Deploy Next BAse URL", process.env.DEPLOY_PRIME_URL)
  const baseUrl = process.env.DEPLOY_URL || "http://localhost:8888";
  console.log(baseUrl);
  // await new Promise(resolve => setTimeout(resolve, 5000));

  const response = await fetch(`${baseUrl}/.netlify/functions/wordpress-api`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

async function ProductList() {
  const products = await getProducts();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
