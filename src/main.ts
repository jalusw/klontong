import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { queryClient } from "./core/query";

import "./styles/style.css";
import App from "./App.vue";
import router from "./core/router";
import { useAuthStore } from "./stores/auth";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia).use(router).use(VueQueryPlugin, { queryClient });

const authStore = useAuthStore();
authStore.initializeAuth();

app.mount("#app");
