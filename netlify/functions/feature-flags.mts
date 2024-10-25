import { getStore } from "@netlify/blobs";

export default async (req: Request) => {
  const store = getStore("admin-settings");

  if (req.method === "GET") {

 let flags = {
  "darkMode": true,
  "orderSource": "sfcc"
 }
  await store.set("feature-flags", JSON.stringify(flags));
  
  const featureFlags = await store.get("feature-flags", {type: 'json'} );

    return Response.json(featureFlags || [], { status: 200 });
  }

  // if (req.method === "PUT") {
  //   const body = await req.json();
  //   await store.setJSON("todos", body);
  //   return new Response("Todos updated", { status: 200 });
  // }

  return new Response("Unsupported method", { status: 405 });
};
// export default async (req: Request, context: Context) => {
//   const featureFlags = getStore("feature-flags");
//   await featureFlags.set("darkMode", true);
//   await featureFlags.set("orderSoure", "sfcc");

//   return Response.json(todos || [], { status: 200 });

// };