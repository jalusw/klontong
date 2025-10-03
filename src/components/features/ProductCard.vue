<script setup lang="ts">
import { ref } from "vue";
import Card from "../ui/Card.vue";

import type { Product } from "../../types/product";

const props = defineProps<{
  product: Product;
}>();

const product = ref(props.product);
</script>

<template>
  <Card>
    <RouterLink :to="{ name: 'Product', params: { id: String(product._id ?? product.id) } }">
      <img
        :src="product.image"
        :alt="product.name"
        class="h-48 w-full rounded-md bg-gray-100 object-cover"
      />
      <div class="p-4">
        <p class="text-sm text-gray-500">{{ product.categoryName }}</p>
        <h3 class="line-clamp-1 text-xl font-bold">{{ product.name }}</h3>
        <p class="mt-2">Rp. {{ Number(product.price).toLocaleString("id-ID") }}</p>
      </div>
    </RouterLink>
  </Card>
</template>
