"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_LIVE_ANSWERS, type LiveAnswers } from "./live-app";

type LiveStore = { answers: LiveAnswers; setAnswer: <K extends keyof LiveAnswers>(key: K, value: LiveAnswers[K]) => void; reset: () => void };
export const useLiveStore = create<LiveStore>()(persist((set) => ({
  answers: INITIAL_LIVE_ANSWERS,
  setAnswer: (key, value) => set((state) => ({ answers: { ...state.answers, [key]: value } })),
  reset: () => set({ answers: INITIAL_LIVE_ANSWERS }),
}), { name: "mindful-dev-live-draft", merge: (saved, current) => ({ ...current, ...(saved as Partial<LiveStore>), answers: { ...INITIAL_LIVE_ANSWERS, ...(saved as Partial<LiveStore>).answers } }) }));
