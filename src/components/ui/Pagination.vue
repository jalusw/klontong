<script setup lang="ts">
import { computed } from "vue";
import Button from "./Button.vue";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-vue-next";

interface Props {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
}

interface Emits {
  (e: "update:page", page: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const startItem = computed(() => (props.currentPage - 1) * props.limit + 1);
const endItem = computed(() => Math.min(props.currentPage * props.limit, props.total));

const visiblePages = computed(() => {
  const pages: number[] = [];
  const start = Math.max(1, props.currentPage - 2);
  const end = Math.min(props.totalPages, props.currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit("update:page", page);
  }
};
</script>

<template>
  <div
    class="flex items-center justify-between justify-end border-t border-gray-200 bg-white py-3 sm:px-6 md:justify-between"
  >
    <div class="flex sm:flex-1 sm:items-center sm:justify-between">
      <div class="hidden sm:block">
        <p class="text-sm text-gray-700">
          Menampilkan
          <span class="font-medium">{{ startItem }}</span>
          sampai
          <span class="font-medium">{{ endItem }}</span>
          dari
          <span class="font-medium">{{ total }}</span>
          hasil
        </p>
      </div>
      <div class="flex items-center gap-x-4">
        <nav class="inline-flex gap-x-4 -space-x-px rounded-md" aria-label="Pagination">
          <Button
            variant="outline"
            class="rounded-l-md"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <span class="sr-only">Sebelumnya</span>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </Button>

          <template v-if="visiblePages.length > 0 && visiblePages[0]! > 1">
            <Button class="w-10" variant="outline" @click="goToPage(1)"> 1 </Button>
            <span
              v-if="visiblePages[0]! > 2"
              class="inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
            >
              ...
            </span>
          </template>

          <Button
            v-for="page in visiblePages"
            :key="page"
            class="w-10"
            :variant="page === currentPage ? 'primary' : 'outline'"
            @click="goToPage(page)"
          >
            {{ page }}
          </Button>

          <template
            v-if="visiblePages.length > 0 && visiblePages[visiblePages.length - 1]! < totalPages"
          >
            <span
              v-if="visiblePages[visiblePages.length - 1]! < totalPages - 1"
              class="inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
            >
              ...
            </span>
            <Button variant="outline" @click="goToPage(totalPages)">
              {{ totalPages }}
            </Button>
          </template>

          <Button
            variant="outline"
            class="rounded-r-md"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <span class="sr-only">Selanjutnya</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </Button>
        </nav>
      </div>
    </div>
  </div>
</template>
