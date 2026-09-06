import { createJSONStorage } from "zustand/middleware";

/**
 * Persisted stores use localStorage in the browser. On the server — and in
 * tests — there is none, so fall back to memory instead of letting zustand
 * warn on every write.
 */
const memory = new Map<string, string>();

export const browserStorage = createJSONStorage(() =>
  typeof window === "undefined"
    ? {
        getItem: (key: string) => memory.get(key) ?? null,
        setItem: (key: string, value: string) => {
          memory.set(key, value);
        },
        removeItem: (key: string) => {
          memory.delete(key);
        },
      }
    : window.localStorage,
);
