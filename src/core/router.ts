import { createWebHistory, createRouter, type RouteRecordRaw } from "vue-router";

import LoginScreen from "../screens/LoginScreen.vue";
import ProductsScreen from "../screens/ProductsScreen.vue";
import { useAuthStore } from "../stores/auth";
import ProductScreen from "../screens/ProductScreen.vue";
import ProductCreateScreen from "../screens/ProductCreateScreen.vue";
import RegisterScreen from "../screens/RegisterScreen.vue";
import ProductEditScreen from "../screens/ProductEditScreen.vue";
import NotFound from "../screens/NotFound.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/products",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginScreen,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterScreen,
  },
  {
    path: "/products",
    name: "Products",
    component: ProductsScreen,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/products/create",
    name: "ProductCreate",
    component: ProductCreateScreen,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/products/:id",
    name: "Product",
    component: ProductScreen,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/products/:id/edit",
    name: "ProductEdit",
    component: ProductEditScreen,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for authentication
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if (requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (requiresAdmin && !authStore.isAdmin) {
    next("/products");
  } else if ((to.path === "/login" || to.path === "/register") && authStore.isAuthenticated) {
    next("/products");
  } else {
    next();
  }
});

export default router;
