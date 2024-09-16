import type { Config } from "@netlify/functions";


const query = `
  {
    allShopifyProduct(sort: {title: ASC}) {
      nodes {
        id
        title
        shopifyId
        featuredImage {
          src
          altText
        }
        priceRange {
          maxVariantPrice {
            amount
          }
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
  const nodes = result?.data?.allShopifyProduct?.nodes || [];

  return nodes.map(node => ({
    id: node.id,
    title: node.title,
    shopifyId: node.shopifyId,
    imageUrl: node.featuredImage?.src || null,
    price: node.priceRange.maxVariantPrice.amount,
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