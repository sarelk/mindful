"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_ANSWERS, type ProjectAnswers } from "./project";

type ProjectStore = {
  answers: ProjectAnswers;
  setAnswer: <Key extends keyof ProjectAnswers>(key: Key, value: ProjectAnswers[Key]) => void;
  reset: () => void;
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      answers: INITIAL_ANSWERS,
      setAnswer: (key, value) =>
        set((state) => ({ answers: { ...state.answers, [key]: value } })),
      reset: () => set({ answers: INITIAL_ANSWERS }),
    }),
    {
      name: "mindful-dev-draft",
      merge: (persisted, current) => {
        const saved = persisted as Partial<ProjectStore>;
        return {
          ...current,
          ...saved,
          answers: { ...INITIAL_ANSWERS, ...saved.answers },
        };
      },
    },
  ),
);
