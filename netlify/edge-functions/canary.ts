// deno-lint-ignore-file no-explicit-any
import { Context } from "@netlify/edge-functions";
import { HTMLRewriter } from "https://raw.githubusercontent.com/worker-tools/html-rewriter/master/index.ts";

import { MongoClient, ServerApiVersion } from "npm:mongodb";

Object.defineProperty(Deno, "osRelease", {
  value: () => "mock-release",
});

const password = Netlify.env.get("MONGODB_PW");
const mongoUri = `mongodb+srv://whistlerjordan:${password}@dev.z1sv7.mongodb.net/?retryWrites=true&w=majority&appName=Dev`;
let cars: any[];
const ngrokUri = Netlify.env.get("NGROK_URI") || "";

async function getCars(useLocal = false) {
  if (useLocal) {
    try {
      cars = await fetch(`${ngrokUri}`).then((res) => res.json());
      return;
    } catch (e) {
      console.error(e);
    }
  }

  const client = new MongoClient(mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    cars = await client.db("Canary").collection("Items").find().toArray();
  } finally {
    await client.close();
  }
}

function makeCars(cars: any[]) {
  return cars
    .map((car) => `<div class="car"><h2>${car?.Make} ${car?.Model}</h2></div>`)
    .join("");
}

export default async (req: Request, { next }: Context) => {
  const local = req.headers.get("x-local");
  await getCars(!!local);

  return new HTMLRewriter()
    .on(".cars", {
      element(element) {
        element.append(makeCars(cars), { html: true });
      },
    })
    .transform(await next());
};

export const config = { path: "/canary.html" };
