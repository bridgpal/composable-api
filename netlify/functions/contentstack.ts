import type { Config } from "@netlify/functions";


const query = `
query products {
    allContentstackProduct {
      nodes {
        description
        id
        image {
          url
        }
        price
        rating
        stripe_price_id
        title
        location {
          latitude: lat
          longitude: long
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
  const nodes = result?.data?.allContentstackProduct?.nodes || [];

  return nodes.map(node => ({
    id: node.id,
    title: node.title,
    description: node.description,
    price: node.price,
    rating: node.rating,
    imageUrl: node.image?.url || null
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