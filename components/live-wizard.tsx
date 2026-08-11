"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Header, PrimaryButton } from "./chrome";
import { LiveResults } from "./live-results";
import { CONSTRAINT_OPTIONS, EVIDENCE_TYPES, LIVE_GOALS, LIVE_STAGES, OTHER_OPTION, goalContext, type LiveAnswers } from "@/lib/live-app";
import { useLiveStore } from "@/lib/live-store";

type Key = keyof LiveAnswers;
type Step = { key: Key; eyebrow: string; title: string; explanation: string; kind: "text" | "short" | "url" | "choice" | "multi"; options?: readonly string[]; placeholder?: string; prompts?: string[]; optional?: boolean };

function liveSteps(a: LiveAnswers): Step[] {
  const context = goalContext(a.goal);
  return [
    { key: "appName", eyebrow: "The product", title: "What is your app called?", explanation: "Optional. Add a working name if you have one, or continue without it.", kind: "short", placeholder: "e.g. Northstar", optional: true },
    { key: "appUrl", eyebrow: "The reference", title: "Where can we see it?", explanation: "Optional. Add the live product or landing-page link as context for your final brief, or skip this step.", kind: "url", placeholder: "https://yourapp.com", optional: true },
    { key: "stage", eyebrow: "The stage", title: "How far has it shipped?", explanation: "Stage changes what good advice looks like. Choose the closest description today.", kind: "choice", options: [...LIVE_STAGES, OTHER_OPTION] },
    { key: "audience", eyebrow: "The people", title: "Which specific users matter right now?", explanation: "Name the narrowest group whose behavior you want to change—not everyone the app could eventually serve.", kind: "text", placeholder: "Freelance designers sending their first client proposal…", prompts: ["Role or situation", "Existing behavior", "Why this group now"] },
    { key: "value", eyebrow: "The value", title: "What useful outcome can they get today?", explanation: "Describe what is already possible in the shipped product, not the long-term vision.", kind: "text", placeholder: "They can turn meeting notes into an assigned, shareable action plan in under five minutes…", prompts: ["Core action", "Result received", "Time or effort saved"] },
    { key: "goal", eyebrow: "The decision", title: "What needs to improve next?", explanation: "Choose one objective. The rest of the checkup will adapt around this bottleneck.", kind: "choice", options: [...LIVE_GOALS, OTHER_OPTION] },
    { key: "evidenceTypes", eyebrow: "The evidence", title: `What tells you ${context.focus} is the issue?`, explanation: "Select the evidence you actually have. An honest assumption is more useful than false certainty.", kind: "multi", options: [...EVIDENCE_TYPES, OTHER_OPTION] },
    { key: "evidenceDetail", eyebrow: "The signal", title: "What did you observe, specifically?", explanation: "Use counts, quotes, behaviors, or repeated patterns. Avoid conclusions such as “users don't like it” without saying what happened.", kind: "text", placeholder: `e.g. 18 of 30 new users stopped before the core action; three said…`, prompts: ["How many users?", "What did they do or say?", "When did this happen?"] },
    { key: "friction", eyebrow: "The bottleneck", title: "Where does the critical journey break down?", explanation: `Focus on one moment connected to ${context.focus}. Describe the expected behavior and what happens instead.`, kind: "text", placeholder: "After signup, users should import their first file. Instead, they reach an empty dashboard and leave…", prompts: ["Expected behavior", "Observed behavior", "Exact step"] },
    { key: "attempted", eyebrow: "The history", title: "What have you already tried?", explanation: "Previous attempts prevent recycled advice and expose what the next test must do differently.", kind: "text", placeholder: "We shortened onboarding from five steps to three, but did not track whether activation changed…", optional: true, prompts: ["What changed?", "What happened?", "What remains uncertain?"] },
    { key: "successMetric", eyebrow: "The measure", title: "What observable change would count as progress?", explanation: `A useful default for this objective is “${context.defaultMetric}.” Make it more specific if you can.`, kind: "text", placeholder: `${context.defaultMetric}, measured over…`, prompts: ["Behavior, not sentiment", "Baseline and target", "Time window"] },
    { key: "constraints", eyebrow: "The boundaries", title: "What must the next move work within?", explanation: "Constraints shape the size and reversibility of the experiment.", kind: "multi", options: [...CONSTRAINT_OPTIONS, OTHER_OPTION], optional: true },
    { key: "capacity", eyebrow: "The commitment", title: "What can you realistically act on now?", explanation: "Describe the people and time available. Your plan will use this as its scope boundary.", kind: "text", placeholder: "One founder and one engineer, about two focused days this week…", prompts: ["Who is available?", "How much focused time?", "Any release restrictions?"] },
  ];
}

function Field({ step }: { step: Step }) {
  const { answers, setAnswer } = useLiveStore();
  const value = answers[step.key];
  if (step.kind === "choice" || step.kind === "multi") {
    const selected = Array.isArray(value) ? value : value ? [value] : [];
    const choose = (option: string) => step.kind === "multi"
      ? setAnswer(step.key, (selected.includes(option) ? selected.filter((x) => x !== option) : [...selected, option]) as never)
      : setAnswer(step.key, option as never);
    const showsOther = selected.includes(OTHER_OPTION);
    const otherKey = step.key as "stage" | "goal" | "evidenceTypes" | "constraints";
    return <><div className="choice-grid">{step.options?.map((option, index) => <button type="button" className={`choice${selected.includes(option) ? " selected" : ""}`} aria-pressed={selected.includes(option)} onClick={() => choose(option)} key={option}><span>{String(index + 1).padStart(2, "0")}</span>{option}<b>{selected.includes(option) ? "✓" : ""}</b></button>)}</div>{showsOther && <input className="compact-input other-detail" aria-label={`Other ${step.key}`} value={answers.otherDetails[otherKey] ?? ""} onChange={(event) => setAnswer("otherDetails", { ...answers.otherDetails, [otherKey]: event.target.value })} placeholder="Tell us what fits better…" />}</>;
  }
  if (step.kind === "url" || step.kind === "short") return <input className="compact-input" type={step.kind === "url" ? "url" : "text"} inputMode={step.kind === "url" ? "url" : "text"} value={String(value)} onChange={(e) => setAnswer(step.key, e.target.value as never)} placeholder={step.placeholder} />;
  return <textarea value={String(value)} onChange={(e) => setAnswer(step.key, e.target.value as never)} placeholder={step.placeholder} />;
}

export function LiveWizard({ onExit }: { onExit: () => void }) {
  const [index, setIndex] = useState(0); const [showResults, setShowResults] = useState(false);
  const answers = useLiveStore((s) => s.answers); const steps = useMemo(() => liveSteps(answers), [answers]); const step = steps[index];
  const back = useCallback(() => index === 0 ? onExit() : setIndex((x) => x - 1), [index, onExit]);
  const next = useCallback(() => index === steps.length - 1 ? setShowResults(true) : setIndex((x) => x + 1), [index, steps.length]);
  useEffect(() => { const key = (e: KeyboardEvent) => { if (e.key === "Escape") back(); }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, [back]);
  if (showResults) return <LiveResults onBack={() => setShowResults(false)} onHome={onExit} />;
  return <main className="wizard live-wizard"><Header compact />
    <div className="progress-wrap"><div className="progress-meta"><span>LIVE APP CHECKUP · {answers.goal || "YOUR CONTEXT"}</span><span>{String(index + 1).padStart(2, "0")} <i>/</i> {steps.length}</span></div><div className="progress-track"><i style={{ width: `${((index + 1) / steps.length) * 100}%` }} /></div></div>
    <section className="wizard-body"><div className="question"><p className="question-eyebrow">{step.eyebrow}</p><h2>{step.title}</h2><p className="question-explanation">{step.explanation}</p><div className="answer-label"><span>{step.kind === "multi" ? "Choose all that apply" : step.kind === "choice" ? "Choose the closest fit" : "Write in your own words"}</span><span>Optional · Specific answers improve your output</span></div><Field step={step} />{step.prompts && <div className="prompt-notes"><span>Consider:</span>{step.prompts.map((x) => <span key={x}>· {x}</span>)}</div>}</div></section>
    <nav className="wizard-nav"><button className="back" onClick={back}>← Back</button><span className="saved">✓ Live app draft saved locally</span><div className="nav-actions"><button className="skip" onClick={next}>Skip</button><PrimaryButton onClick={next}>{index === steps.length - 1 ? "Create next move" : "Continue"}</PrimaryButton></div></nav>
  </main>;
}
