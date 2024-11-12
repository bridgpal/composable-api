import type { Config } from "@netlify/functions";

const query = `
query MyQuery {
  allWpPost {
    edges {
      node {
        id
        acf {
          price
          productImage
        }
        title {
          raw
        }
      }
    }
  }
}
`;

async function getProducts() {
  const apiUrl = process.env.WORDPRESS_CONNECT_API_URL;
  if (!apiUrl) throw new Error("WORDPRESS_CONNECT_API_URL is not defined");

  const res = await fetch(apiUrl, {
    method: `POST`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WORDPRESS_CONNECT_API_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });

  const result = await res.json();
  const nodes = result?.data?.allWpPost?.edges || [];
  console.log("ALL PRODUCTS", nodes);

  // .filter((node: any) => node.node.acf?.productImage)

  return nodes
  .filter((node: any) => node.node.acf?.productImage)
  .map((node: any) => ({
    id: node.node.id,
    title: node.node.title.raw,
    imageUrl: node.node.acf?.productImage || null,
    price: node.node.acf?.price.substring(1) || null,
  }));
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
