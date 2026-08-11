"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Header, PrimaryButton } from "./chrome";
import { LiveResults } from "./live-results";
import { CONSTRAINT_OPTIONS, EVIDENCE_TYPES, LIVE_GOALS, LIVE_STAGES, OTHER_OPTION, goalContext } from "@/lib/live-app";
import { useLiveStore } from "@/lib/live-store";

type StepKind = "product" | "people" | "goal" | "evidence" | "friction" | "attempted" | "success" | "capacity";
type Step = { kind: StepKind; eyebrow: string; title: string; explanation: string };
type ChoiceKey = "stage" | "goal" | "evidenceTypes" | "constraints";

function liveSteps(goal: string): Step[] {
  const context = goalContext(goal);
  return [
    { kind: "product", eyebrow: "The product", title: "What have you shipped?", explanation: "A little context is enough. Add whatever you already know and leave the rest blank." },
    { kind: "people", eyebrow: "The people", title: "Who is it helping?", explanation: "Tell us who matters right now and what useful thing they can already do with the product." },
    { kind: "goal", eyebrow: "The next move", title: "What are you trying to improve?", explanation: "Choose the closest goal. This shapes the rest of the checkup." },
    { kind: "evidence", eyebrow: "What you know", title: "What have you noticed?", explanation: `Share what makes you think ${context.focus} needs attention. A hunch is a perfectly valid starting point.` },
    { kind: "friction", eyebrow: "The sticking point", title: "Where does it feel stuck?", explanation: "Describe one moment where people hesitate, leave, fail, or do something different from what you expected." },
    { kind: "attempted", eyebrow: "What changed", title: "What have you already tried?", explanation: "A quick note helps us avoid sending you back toward something that did not work." },
    { kind: "success", eyebrow: "A useful signal", title: "What would tell you it worked?", explanation: `A useful starting point is “${context.defaultMetric}.” Use that or describe a better signal.` },
    { kind: "capacity", eyebrow: "Right now", title: "What can you take on next?", explanation: "Choose the boundaries and tell us roughly who—or how much time—is available." },
  ];
}

function ChoiceInput({ field, options, multiple = false }: { field: ChoiceKey; options: readonly string[]; multiple?: boolean }) {
  const { answers, setAnswer } = useLiveStore();
  const value = answers[field]; const selected = Array.isArray(value) ? value : value ? [value] : [];
  const choose = (option: string) => multiple
    ? setAnswer(field, (selected.includes(option) ? selected.filter((x) => x !== option) : [...selected, option]) as never)
    : setAnswer(field, option as never);
  return <><div className="choice-grid">{options.map((option, index) => <button type="button" className={`choice${selected.includes(option) ? " selected" : ""}`} aria-pressed={selected.includes(option)} onClick={() => choose(option)} key={option}><span>{String(index + 1).padStart(2, "0")}</span>{option}<b>{selected.includes(option) ? "✓" : ""}</b></button>)}</div>{selected.includes(OTHER_OPTION) && <input className="compact-input other-detail" aria-label={`Other ${field}`} value={answers.otherDetails[field] ?? ""} onChange={(event) => setAnswer("otherDetails", { ...answers.otherDetails, [field]: event.target.value })} placeholder="Tell us what fits better…" />}</>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="group-label">{children}</label>;
}

function StepFields({ kind }: { kind: StepKind }) {
  const { answers, setAnswer } = useLiveStore();
  switch (kind) {
    case "product": return <div className="grouped-fields">
      <FieldLabel>App name <small>optional</small></FieldLabel><input className="compact-input" value={answers.appName} onChange={(e) => setAnswer("appName", e.target.value)} placeholder="e.g. Northstar" />
      <FieldLabel>Live link <small>optional</small></FieldLabel><input className="compact-input" type="url" inputMode="url" value={answers.appUrl} onChange={(e) => setAnswer("appUrl", e.target.value)} placeholder="https://yourapp.com" />
      <FieldLabel>Current stage</FieldLabel><ChoiceInput field="stage" options={[...LIVE_STAGES, OTHER_OPTION]} />
    </div>;
    case "people": return <div className="grouped-fields paired-fields">
      <div><FieldLabel>Who is it for?</FieldLabel><textarea value={answers.audience} onChange={(e) => setAnswer("audience", e.target.value)} placeholder="Freelance designers sending their first client proposal…" /></div>
      <div><FieldLabel>What can they do today?</FieldLabel><textarea value={answers.value} onChange={(e) => setAnswer("value", e.target.value)} placeholder="Turn meeting notes into a shareable action plan…" /></div>
    </div>;
    case "goal": return <ChoiceInput field="goal" options={[...LIVE_GOALS, OTHER_OPTION]} />;
    case "evidence": return <div className="grouped-fields"><FieldLabel>Where is the signal coming from?</FieldLabel><ChoiceInput field="evidenceTypes" options={[...EVIDENCE_TYPES, OTHER_OPTION]} multiple /><FieldLabel>What happened?</FieldLabel><textarea value={answers.evidenceDetail} onChange={(e) => setAnswer("evidenceDetail", e.target.value)} placeholder="18 of 30 new users stopped before the core action; three said…" /></div>;
    case "friction": return <textarea value={answers.friction} onChange={(e) => setAnswer("friction", e.target.value)} placeholder="After signup, users reach an empty dashboard and leave…" />;
    case "attempted": return <textarea value={answers.attempted} onChange={(e) => setAnswer("attempted", e.target.value)} placeholder="We shortened onboarding, but did not track whether activation changed…" />;
    case "success": return <textarea value={answers.successMetric} onChange={(e) => setAnswer("successMetric", e.target.value)} placeholder="More new users complete the first valuable action within one day…" />;
    case "capacity": return <div className="grouped-fields"><FieldLabel>What must this fit within?</FieldLabel><ChoiceInput field="constraints" options={[...CONSTRAINT_OPTIONS, OTHER_OPTION]} multiple /><FieldLabel>Who and how much time is available?</FieldLabel><textarea value={answers.capacity} onChange={(e) => setAnswer("capacity", e.target.value)} placeholder="One founder and one engineer, about two focused days this week…" /></div>;
  }
}

export function LiveWizard({ onExit }: { onExit: () => void }) {
  const [index, setIndex] = useState(0); const [showResults, setShowResults] = useState(false);
  const answers = useLiveStore((s) => s.answers); const steps = useMemo(() => liveSteps(answers.goal), [answers.goal]); const step = steps[index];
  const back = useCallback(() => index === 0 ? onExit() : setIndex((x) => x - 1), [index, onExit]);
  const next = useCallback(() => index === steps.length - 1 ? setShowResults(true) : setIndex((x) => x + 1), [index, steps.length]);
  useEffect(() => { const key = (e: KeyboardEvent) => { if (e.key === "Escape") back(); }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, [back]);
  if (showResults) return <LiveResults onBack={() => setShowResults(false)} onHome={onExit} />;
  return <main className="wizard live-wizard"><Header compact />
    <div className="progress-wrap"><div className="progress-meta"><span>LIVE APP CHECKUP · {answers.goal || "YOUR CONTEXT"}</span><span>{String(index + 1).padStart(2, "0")} <i>/</i> {steps.length}</span></div><div className="progress-track"><i style={{ width: `${((index + 1) / steps.length) * 100}%` }} /></div></div>
    <section className="wizard-body"><div className="question"><p className="question-eyebrow">{step.eyebrow}</p><h2>{step.title}</h2><p className="question-explanation">{step.explanation}</p><div className="answer-label"><span>Answer what you can</span><span>Everything is optional</span></div><StepFields kind={step.kind} /></div></section>
    <nav className="wizard-nav"><button className="back" onClick={back}>← Back</button><span className="saved">✓ Live app draft saved locally</span><div className="nav-actions"><button className="skip" onClick={next}>Skip</button><PrimaryButton onClick={next}>{index === steps.length - 1 ? "Create next move" : "Continue"}</PrimaryButton></div></nav>
  </main>;
}
