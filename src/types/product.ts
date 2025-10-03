import { z } from "zod";

export type Product = {
  _id?: string; // crudcrud.com id
  id?: string | number; // json-server id;
  categoryId: number;
  categoryName: string;
  sku: string;
  name: string;
  description?: string;
  weight: number;
  width: number;
  length: number;
  height: number;
  image?: string;
  price: number;
};

export const createProductSchema = z.object({
  categoryId: z.number().min(0, "Category ID harus 0 atau lebih"),
  categoryName: z.string().min(1, "Nama kategori wajib diisi").trim(),
  sku: z.string().min(1, "SKU wajib diisi").trim(),
  name: z.string().min(1, "Nama produk wajib diisi").trim(),
  description: z.string().optional(),
  weight: z.number().positive("Berat harus lebih dari 0"),
  width: z.number().positive("Lebar harus lebih dari 0"),
  length: z.number().positive("Panjang harus lebih dari 0"),
  height: z.number().positive("Tinggi harus lebih dari 0"),
  image: z.string().url("Format URL gambar tidak valid").optional().or(z.literal("")),
  price: z.number().positive("Harga harus lebih dari 0"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
