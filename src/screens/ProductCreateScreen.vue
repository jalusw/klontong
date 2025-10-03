<script setup lang="ts">
import BaseLayout from "../components/layouts/BaseLayout.vue";
import Card from "../components/ui/Card.vue";
import Input from "../components/ui/Input.vue";
import Label from "../components/ui/Label.vue";
import Button from "../components/ui/Button.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useForm } from "@tanstack/vue-form";
import productsRepo from "../repositories/products.repo";
import type { CreateProductInput } from "../types/product";
import { createProductSchema } from "../types/product";
import { ArrowLeftIcon, SaveIcon } from "lucide-vue-next";
import { z } from "zod";

const router = useRouter();
const queryClient = useQueryClient();

const { mutateAsync, isPending } = useMutation({
  mutationFn: (payload: CreateProductInput) => productsRepo.create(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  },
});

const submitFieldErrors = ref<Record<string, string>>({});
const setFieldError = (key: string, message: string) => {
  submitFieldErrors.value = { ...submitFieldErrors.value, [key]: message };
};
const clearFieldError = (key: string) => {
  if (submitFieldErrors.value[key]) {
    const rest = { ...submitFieldErrors.value } as Record<string, string>;
    delete rest[key];
    submitFieldErrors.value = rest;
  }
};

const validateSku = (value: string) => {
  const result = createProductSchema.shape.sku.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
};

const validateName = (value: string) => {
  const result = createProductSchema.shape.name.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
};

const validatePrice = (value: number) => {
  const result = createProductSchema.shape.price.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
};

const validateWeight = (value: number) => {
  const result = createProductSchema.shape.weight.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
};

const validateWidth = (value: number) => {
  const result = createProductSchema.shape.width.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
};

const validateLength = (value: number) => {
  const result = createProductSchema.shape.length.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
};

const validateHeight = (value: number) => {
  const result = createProductSchema.shape.height.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
};

const validateCategoryName = (value: string) => {
  return !value ? "Nama kategori wajib diisi" : undefined;
};

const form = useForm({
  defaultValues: {
    sku: "",
    name: "",
    description: "",
    categoryId: 0,
    categoryName: "",
    price: 0,
    weight: 0,
    width: 0,
    length: 0,
    height: 0,
    image: "",
  } as CreateProductInput & { categoryName: string },
  onSubmit: async ({ value }) => {
    try {
      submitFieldErrors.value = {};
      if (!value.categoryName || !value.categoryName.trim()) {
        setFieldError("categoryName", "Nama kategori wajib diisi.");
        return;
      }

      const payload = {
        ...value,
        categoryId: 0,
        description: value.description || "",
        image: value.image || "",
      };

      const parsed = createProductSchema.safeParse(payload);
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const key = (issue.path?.[0] ?? "") as string;
          if (key) setFieldError(key, issue.message);
        }
        return;
      }

      submitFieldErrors.value = {};

      await mutateAsync(parsed.data);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push({ name: "Products" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        for (const issue of error.issues) {
          const key = (issue.path?.[0] ?? "") as string;
          if (key) setFieldError(key, issue.message);
        }
      } else {
        setFieldError("_form", "Gagal menyimpan produk. Coba lagi.");
      }
    }
  },
});
</script>

<template>
  <BaseLayout>
    <div class="">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Tambah Produk Baru</h1>
        <Button variant="ghost" class="flex items-center gap-2" @click="router.back()">
          <ArrowLeftIcon class="h-4 w-4" />
          Kembali
        </Button>
      </div>

      <Card>
        <form class="space-y-4 p-6" @submit.prevent="form.handleSubmit">
          <!-- SKU & Name -->
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field name="sku" :validate="validateSku">
              <template #default="{ field, state }">
                <div>
                  <Label for="sku">SKU *</Label>
                  <Input
                    id="sku"
                    :model-value="field.state.value"
                    placeholder="Masukkan SKU produk"
                    :class="{
                      'border-red-500': state.meta.errors.length || submitFieldErrors.sku,
                    }"
                    @update:model-value="
                      (val) => {
                        clearFieldError('sku');
                        field.handleChange(val);
                      }
                    "
                    @blur="field.handleBlur"
                  />
                  <p
                    v-if="state.meta.errors.length || submitFieldErrors.sku"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ state.meta.errors[0] || submitFieldErrors.sku }}
                  </p>
                </div>
              </template>
            </form.Field>

            <form.Field name="name" :validate="validateName">
              <template #default="{ field, state }">
                <div>
                  <Label for="name">Nama Produk *</Label>
                  <Input
                    id="name"
                    :model-value="field.state.value"
                    placeholder="Masukkan nama produk"
                    :class="{
                      'border-red-500': state.meta.errors.length || submitFieldErrors.name,
                    }"
                    @update:model-value="
                      (val) => {
                        clearFieldError('name');
                        field.handleChange(val);
                      }
                    "
                    @blur="field.handleBlur"
                  />
                  <p
                    v-if="state.meta.errors.length || submitFieldErrors.name"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ state.meta.errors[0] || submitFieldErrors.name }}
                  </p>
                </div>
              </template>
            </form.Field>
          </div>

          <!-- Description -->
          <form.Field name="description">
            <template #default="{ field }">
              <div>
                <Label for="description">Deskripsi</Label>
                <textarea
                  id="description"
                  :value="field.state.value"
                  rows="3"
                  placeholder="Deskripsikan produk..."
                  class="shadow-border w-full resize-none rounded p-3 focus:ring focus:outline-none"
                  @input="
                    (e) => {
                      clearFieldError('description');
                      field.handleChange((e.target as HTMLTextAreaElement).value);
                    }
                  "
                  @blur="field.handleBlur"
                />
              </div>
            </template>
          </form.Field>

          <!-- Category & Price -->
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field name="categoryName" :validate="validateCategoryName">
              <template #default="{ field, state }">
                <div>
                  <Label for="categoryName">Kategori *</Label>
                  <Input
                    id="categoryName"
                    :model-value="field.state.value"
                    placeholder="Masukkan nama kategori"
                    :class="{
                      'border-red-500': state.meta.errors.length || submitFieldErrors.categoryName,
                    }"
                    @update:model-value="
                      (val) => {
                        clearFieldError('categoryName');
                        field.handleChange(val);
                      }
                    "
                    @blur="field.handleBlur"
                  />
                  <p
                    v-if="state.meta.errors.length || submitFieldErrors.categoryName"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ state.meta.errors[0] || submitFieldErrors.categoryName }}
                  </p>
                </div>
              </template>
            </form.Field>

            <form.Field name="price" :validate="validatePrice">
              <template #default="{ field, state }">
                <div>
                  <Label for="price">Harga *</Label>
                  <Input
                    id="price"
                    type="number"
                    :model-value="String(field.state.value)"
                    placeholder="0"
                    min="0"
                    :class="{
                      'border-red-500': state.meta.errors.length || submitFieldErrors.price,
                    }"
                    @update:model-value="
                      (val) => {
                        clearFieldError('price');
                        field.handleChange(Number(val));
                      }
                    "
                    @blur="field.handleBlur"
                  />
                  <p
                    v-if="state.meta.errors.length || submitFieldErrors.price"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ state.meta.errors[0] || submitFieldErrors.price }}
                  </p>
                </div>
              </template>
            </form.Field>
          </div>

          <!-- Weight -->
          <form.Field name="weight" :validate="validateWeight">
            <template #default="{ field, state }">
              <div>
                <Label for="weight">Berat (gram) *</Label>
                <Input
                  id="weight"
                  type="number"
                  :model-value="String(field.state.value)"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  :class="{
                    'border-red-500': state.meta.errors.length || submitFieldErrors.weight,
                  }"
                  @update:model-value="
                    (val) => {
                      clearFieldError('weight');
                      field.handleChange(Number(val));
                    }
                  "
                  @blur="field.handleBlur"
                />
                <p
                  v-if="state.meta.errors.length || submitFieldErrors.weight"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ state.meta.errors[0] || submitFieldErrors.weight }}
                </p>
              </div>
            </template>
          </form.Field>

          <!-- Dimensions -->
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <form.Field name="width" :validate="validateWidth">
              <template #default="{ field, state }">
                <div>
                  <Label for="width">Lebar (cm) *</Label>
                  <Input
                    id="width"
                    type="number"
                    :model-value="String(field.state.value)"
                    placeholder="0"
                    min="0"
                    step="0.1"
                    :class="{
                      'border-red-500': state.meta.errors.length || submitFieldErrors.width,
                    }"
                    @update:model-value="
                      (val) => {
                        clearFieldError('width');
                        field.handleChange(Number(val));
                      }
                    "
                    @blur="field.handleBlur"
                  />
                  <p
                    v-if="state.meta.errors.length || submitFieldErrors.width"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ state.meta.errors[0] || submitFieldErrors.width }}
                  </p>
                </div>
              </template>
            </form.Field>

            <form.Field name="length" :validate="validateLength">
              <template #default="{ field, state }">
                <div>
                  <Label for="length">Panjang (cm) *</Label>
                  <Input
                    id="length"
                    type="number"
                    :model-value="String(field.state.value)"
                    placeholder="0"
                    min="0"
                    step="0.1"
                    :class="{
                      'border-red-500': state.meta.errors.length || submitFieldErrors.length,
                    }"
                    @update:model-value="
                      (val) => {
                        clearFieldError('length');
                        field.handleChange(Number(val));
                      }
                    "
                    @blur="field.handleBlur"
                  />
                  <p
                    v-if="state.meta.errors.length || submitFieldErrors.length"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ state.meta.errors[0] || submitFieldErrors.length }}
                  </p>
                </div>
              </template>
            </form.Field>

            <form.Field name="height" :validate="validateHeight">
              <template #default="{ field, state }">
                <div>
                  <Label for="height">Tinggi (cm) *</Label>
                  <Input
                    id="height"
                    type="number"
                    :model-value="String(field.state.value)"
                    placeholder="0"
                    min="0"
                    step="0.1"
                    :class="{
                      'border-red-500': state.meta.errors.length || submitFieldErrors.height,
                    }"
                    @update:model-value="
                      (val) => {
                        clearFieldError('height');
                        field.handleChange(Number(val));
                      }
                    "
                    @blur="field.handleBlur"
                  />
                  <p
                    v-if="state.meta.errors.length || submitFieldErrors.height"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ state.meta.errors[0] || submitFieldErrors.height }}
                  </p>
                </div>
              </template>
            </form.Field>
          </div>

          <!-- Image -->
          <form.Field name="image">
            <template #default="{ field }">
              <div>
                <Label for="image">URL Gambar</Label>
                <Input
                  id="image"
                  :model-value="field.state.value || ''"
                  placeholder="https://example.com/image.jpg"
                  type="url"
                  @update:model-value="
                    (val) => {
                      clearFieldError('image');
                      field.handleChange(val);
                    }
                  "
                  @blur="field.handleBlur"
                />
                <p v-if="submitFieldErrors.image" class="mt-1 text-sm text-red-600">
                  {{ submitFieldErrors.image }}
                </p>
              </div>
            </template>
          </form.Field>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" @click="router.back()"> Batal </Button>

            <form.Subscribe>
              <template #default="{ canSubmit, isSubmitting }">
                <Button
                  type="submit"
                  :disabled="!canSubmit || isSubmitting || isPending"
                  class="flex items-center gap-2"
                >
                  <SaveIcon class="h-4 w-4" />
                  {{ isSubmitting || isPending ? "Menyimpan..." : "Simpan" }}
                </Button>
              </template>
            </form.Subscribe>
          </div>
        </form>
      </Card>
    </div>
  </BaseLayout>
</template>
