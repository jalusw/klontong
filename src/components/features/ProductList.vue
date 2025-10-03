<script setup lang="ts">
import type { Product } from "../../types/product";
import ProductCard from "./ProductCard.vue";

defineProps<{
  products: Product[];
}>();
</script>

<template>
  <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
    <ProductCard
      v-for="product in products"
      :key="String(product._id ?? product.id ?? product.sku)"
      :product="product"
    />
  </div>
</template>
