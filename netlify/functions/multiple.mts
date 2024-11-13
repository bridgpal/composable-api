import type { Config } from "@netlify/functions";

const query = `
query MyQuery {
  allShopifyproduct(limit: 16) {
    nodes {
      id
      title
      priceRangeV2 {
        maxVariantPrice {
          amount
        }
      }
      featuredImage {
        url
        altText
      }
    }
  }
  allContentstackproducts {
    nodes {
      id
      price
      title
      product_image {
        url
      }
    }
  }
}
`;

async function getProducts() {
  const apiUrl = process.env.NETLIFY_CONNECT_API_URL;
  if (!apiUrl) throw new Error("NETLIFY_CONNECT_API_URL is not defined");

  const res = await fetch(apiUrl, {
    method: `POST`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NETLIFY_CONNECT_API_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });

  const result = await res.json();
  const nodes = [
    ...(result?.data?.allContentstackproducts?.nodes || []).map((node) => ({
      id: node.id,
      type: "contentstack",
      title: node.title,
      price: node.price,
      imageUrl: node.product_image?.url || null,
    })),
    ...(result?.data?.allShopifyproduct?.nodes || []).map((node) => ({
      id: node.id,
      type: "shopify",
      title: node.title,
      price: node.priceRangeV2?.maxVariantPrice?.amount?.toString() || "0",
      imageUrl: node.featuredImage?.url || null,
    })),
  ]
    // Remove entries without images
    .filter((node) => node.imageUrl !== null)
    // Sort by title alphabetically
    .sort((a, b) => a.title.localeCompare(b.title));

  return nodes;
}

export default async function handler(event: Config) {
  const products = await getProducts();

  return new Response(JSON.stringify(products), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
