<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, type CSSProperties } from "vue";
import { useWindowVirtualizer } from "@tanstack/vue-virtual";
import ProductCard from "./ProductCard.vue";
import type { Product } from "../../types/product";

const props = defineProps<{
  products: Product[];
}>();

const columnCount = ref(2);
const gap = 16; // px, keep in sync with grid gap-4

function onResize() {
  const width = window.innerWidth || document.documentElement.clientWidth || 0;
  if (width >= 1024) columnCount.value = 4;
  else if (width >= 768) columnCount.value = 3;
  else columnCount.value = 2;
}

onMounted(() => {
  onResize();
  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

const rowCount = computed(() => Math.ceil((props.products?.length ?? 0) / columnCount.value));

// Estimate row height: image 192px + content ~ 96px + gaps
const estimateRowHeight = 48 + 192 + 96;

const virtualizer = useWindowVirtualizer({
  count: rowCount.value,
  estimateSize: () => estimateRowHeight,
  overscan: 6,
});

const items = computed(() => virtualizer.value.getVirtualItems());

const gridStyle = computed<CSSProperties>(() => ({
  display: "grid",
  gridTemplateColumns: `repeat(${columnCount.value}, minmax(0, 1fr))`,
  gap: `${gap}px`,
  position: "relative",
  height: `${virtualizer.value.getTotalSize()}px`,
}));

function cellIndex(rowIndex: number, colIndex: number) {
  return rowIndex * columnCount.value + colIndex;
}

watch(rowCount, (n) => {
  const v = virtualizer.value;
  v.setOptions({ ...v.options, count: n });
});
</script>

<template>
  <div>
    <div :style="gridStyle">
      <template v-for="v in items" :key="v.key">
        <div
          class="absolute right-0 left-0"
          :style="{
            transform: `translateY(${v.start}px)`,
            height: `${v.size}px`,
          }"
        >
          <div
            class="grid"
            :style="{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
              gap: `${gap}px`,
            }"
          >
            <template v-for="c in columnCount" :key="c">
              <div v-if="cellIndex(v.index, c - 1) < products.length">
                <ProductCard
                  v-if="products[cellIndex(v.index, c - 1)]"
                  :product="products[cellIndex(v.index, c - 1)] as Product"
                />
              </div>
              <div v-else />
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
