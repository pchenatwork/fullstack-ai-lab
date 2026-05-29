import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { QaEntry } from "./types";

// Session Q&A log. Persisted to sessionStorage so it survives a refresh but is
// cleared when the tab closes (swap to localStorage to survive browser close).
//
// Note: this state is only consumed by the manual-assistant page, so useState would
// suffice — Zustand + persist is used here deliberately to demonstrate the pattern.

interface QaState {
  entries: QaEntry[];
  add: (entry: QaEntry) => void;
  patch: (id: string, fields: Partial<QaEntry>) => void;
  clear: () => void;
}

export const useQaStore = create<QaState>()(
  persist(
    (set) => ({
      entries: [],
      add: (entry) => set((s) => ({ entries: [...s.entries, entry] })),
      patch: (id, fields) =>
        set((s) => ({
          entries: s.entries.map((e) => (e.id === id ? { ...e, ...fields } : e)),
        })),
      clear: () => set({ entries: [] }),
    }),
    {
      name: "manual-qa-log",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
