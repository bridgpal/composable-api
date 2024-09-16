interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
    <img
      src={product.imageUrl}
      alt={product.title}
      className="w-full h-64 object-cover"
    />
    <div className="p-4">
      <span className="text-xs text-indigo-600 font-semibold">
        {product.rating && `${product.rating.toFixed(1)} ★`}
      </span>
      <h2 className="text-lg font-bold mt-1 mb-2">{product.title}</h2>
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold">${product.price}</span>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

export default ProductCard;