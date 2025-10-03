import httpClient from "../core/http";
import type { Product, CreateProductInput } from "../types/product";

export default {
  async all(): Promise<Product[]> {
    const response = await httpClient.get("/products");
    return response.data as Product[];
  },

  async findById(id: string | number): Promise<Product> {
    const response = await httpClient.get(`/products/${id}`);
    return response.data as Product;
  },

  async create(product: CreateProductInput): Promise<Product> {
    const response = await httpClient.post("/products", product);
    return response.data as Product;
  },

  async update(id: string | number, product: Partial<CreateProductInput>): Promise<Product> {
    const response = await httpClient.put(`/products/${id}`, product);
    return response.data as Product;
  },

  async remove(id: string | number): Promise<void> {
    await httpClient.delete(`/products/${id}`);
  },
};
