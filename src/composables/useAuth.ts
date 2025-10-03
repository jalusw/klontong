import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";

export const useAuth = () => {
  const authStore = useAuthStore();

  // Use storeToRefs to maintain reactivity when destructuring
  const { user, isLoading, isAuthenticated, isAdmin } = storeToRefs(authStore);

  return {
    // State
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    // Actions
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    updateUser: authStore.updateUser,
    initializeAuth: authStore.initializeAuth,
  };
};
