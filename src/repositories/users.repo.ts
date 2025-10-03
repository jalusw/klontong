import httpClient from "../core/http";
import type { User } from "../types/user";

export default {
  async all(): Promise<User[]> {
    const response = await httpClient.get("/users");
    return response.data as User[];
  },

  async findById(id: string): Promise<User> {
    const response = await httpClient.get(`/users/${id}`);
    return response.data as User;
  },

  async create(user: Omit<User, "id">): Promise<User> {
    const response = await httpClient.post("/users", user);
    return response.data as User;
  },

  async update(id: string, user: Partial<Omit<User, "id">>): Promise<User> {
    const response = await httpClient.put(`/users/${id}`, user);
    return response.data as User;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/users/${id}`);
  },
};
