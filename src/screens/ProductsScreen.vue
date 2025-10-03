<script setup lang="ts">
import BaseLayout from "../components/layouts/BaseLayout.vue";
import ProductListLoading from "../components/features/ProductListLoading.vue";
import ProductList from "../components/features/ProductList.vue";
import Pagination from "../components/ui/Pagination.vue";

import Input from "../components/ui/Input.vue";
import Button from "../components/ui/Button.vue";
import { SearchIcon } from "lucide-vue-next";
import productsRepo from "../repositories/products.repo";
import { useQuery } from "@tanstack/vue-query";
import { ref, computed } from "vue";

const search = ref("");
const currentPage = ref(1);
const limit = 12;

const {
  data: productsRes,
  isLoading,
  isFetching,
} = useQuery({
  queryKey: ["products"],
  queryFn: () => productsRepo.all(),
});

const allProducts = computed(() => {
  const v = productsRes.value as any;
  return Array.isArray(v) ? v : (v?.data ?? []);
});
const filteredProducts = computed(() => {
  const q = (search.value || "").toLowerCase().trim();
  if (!q) return allProducts.value;
  return allProducts.value.filter((p: any) => {
    const name = String(p.name || "").toLowerCase();
    const desc = String(p.description || "").toLowerCase();
    const sku = String(p.sku || "").toLowerCase();
    const cat = String(p.categoryName || "").toLowerCase();
    return name.includes(q) || desc.includes(q) || sku.includes(q) || cat.includes(q);
  });
});
const total = computed(() => filteredProducts.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)));
const products = computed(() => {
  const start = (currentPage.value - 1) * limit;
  return filteredProducts.value.slice(start, start + limit);
});

const handleSearch = () => {
  currentPage.value = 1;
};
</script>

<template>
  <BaseLayout>
    <div class="mb-6 flex items-center gap-4">
      <Input v-model="search" placeholder="Ketik nama produk..." class="flex-1" />
      <Button :disabled="isFetching" class="flex items-center gap-2" @click="handleSearch">
        <SearchIcon :class="{ 'animate-spin': isFetching }" />
        <span class="hidden md:block">{{ isFetching ? "Searching..." : "Search" }}</span>
      </Button>
    </div>

    <ProductListLoading v-if="isLoading" />

    <template v-else>
      <div v-if="products.length === 0" class="py-12 text-center">
        <div class="mb-2 text-lg text-gray-400">
          <SearchIcon class="mx-auto mb-4 h-12 w-12" />
        </div>
        <h3 class="mb-2 text-lg font-medium text-gray-900">Tidak ada produk yang ditemukan</h3>
        <p class="text-gray-500">
          {{ search ? `Tidak ada hasil untuk "${search}"` : "Tidak ada produk yang tersedia" }}
        </p>
        <Button v-if="search" variant="outline" class="mt-4" @click="search = ''">
          Hapus pencarian
        </Button>
      </div>

      <template v-else>
        <ProductList :products="products" />
        <div class="mt-6">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            :total="total"
            :limit="limit"
            @update:page="(p) => (currentPage = p)"
          />
        </div>
      </template>
    </template>
  </BaseLayout>
</template>
