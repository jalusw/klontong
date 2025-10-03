import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "../types/user";
import usersRepo from "../repositories/users.repo";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const isLoading = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.email === import.meta.env.VITE_ADMIN_EMAIL);

  // Actions
  const initializeAuth = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        user.value = parsedUser;
      }
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("user");
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    isLoading.value = true;

    try {
      // Admin login check
      if (
        credentials.email === import.meta.env.VITE_ADMIN_EMAIL &&
        credentials.password === import.meta.env.VITE_ADMIN_PASSWORD
      ) {
        const adminUser: User = {
          id: 1,
          name: "Admin",
          email: credentials.email,
        };

        user.value = adminUser;

        // Persist to localStorage
        localStorage.setItem("user", JSON.stringify(adminUser));

        return { success: true };
      }

      // Fallback to users repo: naive lookup
      try {
        const all = await usersRepo.all();
        const found = all.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );
        if (found) {
          const logged: User = { id: found.id, name: found.name, email: found.email };
          user.value = logged;
          localStorage.setItem("user", JSON.stringify(logged));
          return { success: true };
        }
      } catch (repoErr) {
        console.warn("Users repo not available:", repoErr);
      }

      return { success: false, error: "Kredensial tidak valid." };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login Gagal." };
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    isLoading.value = true;

    try {
      // Prevent registering admin credentials through public flow
      if (
        userData.email === import.meta.env.VITE_ADMIN_EMAIL &&
        userData.password === import.meta.env.VITE_ADMIN_PASSWORD
      ) {
        return { success: false, error: "Tidak dapat mendaftarkan akun admin." };
      }

      // Create via repo if available
      try {
        const created = await usersRepo.create({
          name: userData.name,
          email: userData.email,
          password: userData.password,
        });
        const registered: User = { id: created.id, name: created.name, email: created.email };
        user.value = registered;
        localStorage.setItem("user", JSON.stringify(registered));
        return { success: true };
      } catch (repoErr) {
        console.warn("Users repo not available, falling back to local-only register:", repoErr);
        // Local-only fallback
        const registered: User = { id: Date.now(), name: userData.name, email: userData.email };
        user.value = registered;
        localStorage.setItem("user", JSON.stringify(registered));
        return { success: true };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Registration failed" };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("user");
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(user.value));
    }
  };

  return {
    // State
    user,
    isLoading,
    // Getters
    isAuthenticated,
    isAdmin,
    // Actions
    initializeAuth,
    login,
    register,
    logout,
    updateUser,
  };
});
