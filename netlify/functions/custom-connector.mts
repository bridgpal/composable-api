import type { Config } from "@netlify/functions";

const query = `
query MyQuery {
  allStoreProduct {
    edges {
      node {
        id
        image
        price
        title
        description
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
    console.log(result);
    console.log(result?.data?.allStoreProduct?.edges);
    const nodes = [
        ...(result?.data?.allStoreProduct?.edges || []).map((node: any) => ({
            id: node.node.id,
            type: "Legacy API",
            title: node.node.title,
            price: node.node.price || "0",
            imageUrl: node.node.image,
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
