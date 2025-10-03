import { QueryClient } from "@tanstack/vue-query";
import { persistQueryClient } from "@tanstack/query-persist-client-core";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import localforage from "localforage";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 24 * 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: { retry: 1 },
  },
});

const storage = localforage.createInstance({
  name: "klontong",
  storeName: "vue-query",
  description: "Persisted TanStack Query cache",
});

const persister = createAsyncStoragePersister({
  storage,
  key: "klontong:vue-query",
  throttleTime: 1000,
});

persistQueryClient({
  queryClient,
  persister,
  dehydrateOptions: {
    shouldDehydrateQuery: (q: any) => q.state.status === "success",
  },
});
