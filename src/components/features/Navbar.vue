<script setup lang="ts">
import Button from "../ui/Button.vue";
import { BoxIcon, DoorOpenIcon } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useAuth } from "../../composables/useAuth";

const appName = import.meta.env.VITE_APP_NAME || "Klontong";

const router = useRouter();
const { user, isAdmin, logout: authLogout } = useAuth();

const logout = () => {
  authLogout();
  router.push("/login");
};
</script>

<template>
  <header
    class="shadow-border sticky top-5 z-50 mt-4 box-border flex h-16 w-full items-center justify-between rounded bg-white/30 px-6 py-2 backdrop-blur-sm"
  >
    <div class="flex items-center justify-between">
      <RouterLink to="/" class="text-primary text-2xl font-bold">
        {{ appName }}
      </RouterLink>
    </div>
    <ul class="flex items-center gap-8">
      <li v-if="isAdmin">
        <RouterLink to="/products/create" class="flex items-center gap-2">
          <BoxIcon class="h-6 w-6" />
          <span class="hidden md:block">Tambah Produk</span>
        </RouterLink>
      </li>
      <li v-if="user">
        <Button
          class="flex items-center gap-2 border-red-600 text-red-600"
          variant="outline"
          @click="logout"
        >
          <DoorOpenIcon />
          <span class="hidden md:block"> Logout </span>
        </Button>
      </li>
    </ul>
  </header>
</template>
