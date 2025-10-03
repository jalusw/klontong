<template>
  <BaseLayout>
    <div class="mx-auto max-w-lg py-20 text-center">
      <h1 class="mb-2 text-4xl font-bold">404</h1>
      <p class="mb-6 text-gray-600">Halaman tidak ditemukan.</p>
      <RouterLink to="/products" class="text-primary underline">Kembali ke Produk</RouterLink>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from "../components/layouts/BaseLayout.vue";
</script>
