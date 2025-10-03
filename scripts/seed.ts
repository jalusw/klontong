/*
  Seeder script to populate products using Faker.
  Usage: pnpm seed:products --count=50
*/
import "dotenv/config";
import axios from "axios";
import { faker } from "@faker-js/faker";

const args = process.argv.slice(2);
const countArg = args.find((a) => a.startsWith("--count="));
const count = countArg ? parseInt(countArg.split("=")[1], 10) : 25;

const baseURL = process.env.VITE_API_BASE_URL;

const http = axios.create({ baseURL });

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeProduct() {
  const length = randInt(5, 100);
  const width = randInt(5, 100);
  const height = randInt(5, 100);
  const weight = randInt(50, 5000);

  return {
    categoryId: 0,
    categoryName: faker.commerce.department(),
    sku: faker.string.alphanumeric({ length: 8 }).toUpperCase(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    weight,
    width,
    length,
    height,
    image: faker.image.urlLoremFlickr({ category: "product" }),
    price: Number(faker.commerce.price({ min: 1000, max: 2000000, dec: 0 })),
  };
}

async function seedProducts() {
  console.warn(`Seeding ${count} products to ${baseURL}/products ...`);
  let success = 0;
  let fail = 0;
  for (let i = 0; i < count; i++) {
    const payload = makeProduct();
    try {
      await http.post("/products", payload);
      success++;
      if ((i + 1) % 10 === 0) console.warn(`  -> ${i + 1} created`);
    } catch (e: any) {
      fail++;
      console.error("Failed to create product", i + 1, e?.response?.status || e?.message);
    }
  }
  console.warn(`Done. Success: ${success}, Failed: ${fail}`);
}

seedProducts().catch((e) => {
  console.error("Seeder crashed:", e);
  process.exit(1);
});
