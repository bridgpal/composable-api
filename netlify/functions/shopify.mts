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
}
`;


async function getProducts() {
  const apiUrl = process.env.NETLIFY_CONNECT_API_URL;
  if (!apiUrl) throw new Error('NETLIFY_CONNECT_API_URL is not defined');

  const res = await fetch(apiUrl, {
    method: `POST`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NETLIFY_CONNECT_API_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });

  const result = await res.json();
  const nodes = result?.data?.allShopifyproduct?.nodes || [];
  console.log("DATA", nodes);
  return nodes
    .filter((node: any) => node.featuredImage?.url) // Filter out nodes without a featuredImage.url
    .map((node: any) => ({
      id: node.id,
      title: node.title,
      imageUrl: node.featuredImage?.url || null,
      price: node.priceRangeV2?.maxVariantPrice?.amount || 0,
    }));
}

export default async function handler(event: Config) {
  const products = await getProducts();

  return new Response(JSON.stringify(products), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
