<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

import BaseLayout from "../components/layouts/BaseLayout.vue";
import Card from "../components/ui/Card.vue";
import Skeleton from "../components/ui/Skeleton.vue";
import Button from "../components/ui/Button.vue";

import productsRepo from "../repositories/products.repo";
import type { Product } from "../types/product";
import { RefreshCcwIcon, Trash2Icon, PencilIcon } from "lucide-vue-next";
import { useAuth } from "../composables/useAuth";

const route = useRoute();
const router = useRouter();
const { isAdmin } = useAuth();
const queryClient = useQueryClient();

const { data, isLoading, isError, refetch } = useQuery<Product, Error>({
  queryKey: ["product", route.params.id],
  queryFn: () => productsRepo.findById(route.params.id as string),
});

const { mutateAsync: remove, isPending: isDeleting } = useMutation({
  mutationFn: (id: string) => productsRepo.remove(id),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ["products"] });
    router.push({ name: "Products" });
  },
});

const onDeleteClick = () => {
  if (typeof globalThis !== "undefined" && globalThis.confirm) {
    const ok = globalThis.confirm("Yakin ingin menghapus produk ini?");
    if (!ok) return;
  }
  remove(String(route.params.id));
};
</script>

<template>
  <BaseLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <Button v-if="isError" variant="ghost" class="flex items-center gap-2" @click="refetch">
          <RefreshCcwIcon class="h-4 w-4" />
          Coba Lagi
        </Button>
        <div v-if="isAdmin" class="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            class="flex items-center gap-2"
            @click="router.push({ name: 'ProductEdit', params: { id: String(route.params.id) } })"
          >
            <PencilIcon class="h-4 w-4" />
            Ubah
          </Button>
          <Button
            variant="danger"
            class="flex items-center gap-2"
            :disabled="isDeleting"
            @click="onDeleteClick"
          >
            <Trash2Icon class="h-4 w-4" />
            {{ isDeleting ? "Menghapus..." : "Hapus" }}
          </Button>
        </div>
      </div>

      <Card v-if="isLoading">
        <div class="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
          <div>
            <Skeleton class="w-full" :height="320" />
          </div>
          <div class="space-y-4 lg:col-span-2">
            <Skeleton class="h-6 w-56" />
            <Skeleton class="h-4 w-32" />
            <Skeleton class="h-5 w-40" />
            <Skeleton class="h-20 w-full" />
            <div class="grid grid-cols-2 gap-4">
              <Skeleton class="h-10 w-full" />
              <Skeleton class="h-10 w-full" />
              <Skeleton class="h-10 w-full" />
              <Skeleton class="h-10 w-full" />
            </div>
          </div>
        </div>
      </Card>

      <!-- Content -->
      <Card v-else>
        <div class="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
          <!-- Image -->
          <div>
            <img
              :src="data?.image || 'https://placehold.co/600x400?text=No+Image'"
              :alt="data?.name || 'Product image'"
              class="h-80 w-full rounded-md bg-gray-100 object-cover"
            />
          </div>

          <!-- Details -->
          <div class="space-y-5 lg:col-span-2">
            <div>
              <p class="text-sm text-gray-500">{{ data?.categoryName }}</p>
              <h2 class="text-2xl font-bold text-gray-900">
                {{ data?.name }}
              </h2>
              <p class="mt-2 text-xl">Rp. {{ data?.price.toLocaleString() }}</p>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="space-y-1">
                <p class="text-sm text-gray-500">SKU</p>
                <p class="font-medium">{{ data?.sku }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm text-gray-500">Kategori</p>
                <p class="font-medium">{{ data?.categoryName }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm text-gray-500">Berat</p>
                <p class="font-medium">{{ data?.weight }} gram</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm text-gray-500">Dimensi (P × L × T)</p>
                <p class="font-medium">
                  {{ data?.length }} × {{ data?.width }} × {{ data?.height }} cm
                </p>
              </div>
            </div>

            <div>
              <p class="mb-1 text-sm text-gray-500">Deskripsi</p>
              <p class="whitespace-pre-line text-gray-800">
                {{ data?.description || "-" }}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </BaseLayout>
</template>
