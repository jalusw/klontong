/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // Use stricter types to satisfy ESLint rules (no-empty-object-type, no-explicit-any)
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}
