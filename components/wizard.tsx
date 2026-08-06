"use client";

import { useCallback, useEffect, useState } from "react";
import { Header, PrimaryButton } from "./chrome";
import { QuestionStep } from "./question-steps";
import { Results } from "./results";
import { canContinue, LAST_QUESTION_STEP, QUESTIONS, RESULT_STEP, TOTAL_STEPS } from "@/lib/questions";
import { useProjectStore } from "@/lib/store";

export function Wizard({ onExit }: { onExit: () => void }) {
  const [step, setStep] = useState(0);
  const answers = useProjectStore((state) => state.answers);
  const allowedToContinue = canContinue(step, answers);
  const next = useCallback(() => setStep((current) => Math.min(RESULT_STEP, current + 1)), []);
  const back = useCallback(() => setStep((current) => Math.max(0, current - 1)), []);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape" && step > 0) back();
      const isWriting = event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement;
      if (event.key === "Enter" && !event.shiftKey && isWriting && allowedToContinue) {
        event.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [allowedToContinue, back, next, step]);

  if (step === RESULT_STEP) return <Results onBack={() => setStep(LAST_QUESTION_STEP)} onHome={onExit} />;
  const question = QUESTIONS[step];

  return <main className="wizard">
    <Header compact />
    <div className="progress-wrap">
      <div className="progress-meta"><span>YOUR PROJECT BRIEF</span><span>{String(step + 1).padStart(2, "0")} <i>/</i> {TOTAL_STEPS}</span></div>
      <div className="progress-track"><i style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} /></div>
    </div>
    <section className="wizard-body"><QuestionStep question={question} /></section>
    <nav className="wizard-nav" aria-label="Wizard navigation">
      <button className="back" onClick={step === 0 ? onExit : back}>← Back</button>
      <span className="saved">✓ Draft saved locally</span>
      <div className="nav-actions">
        {step > 0 && <button className="skip" onClick={next}>Not sure yet · Skip</button>}
        <PrimaryButton disabled={!allowedToContinue} onClick={next}>{step === LAST_QUESTION_STEP ? "Generate specification" : "Continue"}</PrimaryButton>
      </div>
    </nav>
  </main>;
}
