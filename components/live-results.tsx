"use client";
import { useMemo, useState } from "react";
import { Header, PrimaryButton } from "./chrome";
import { evidenceLevel, generateNextMovePack, goalContext } from "@/lib/live-app";
import { useLiveStore } from "@/lib/live-store";
import { downloadMarkdown } from "@/lib/download";

export function LiveResults({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  const answers = useLiveStore((s) => s.answers); const reset = useLiveStore((s) => s.reset); const [copied, setCopied] = useState(false);
  const pack = useMemo(() => generateNextMovePack(answers), [answers]); const playbook = goalContext(answers.goal); const evidence = evidenceLevel(answers);
  const copy = async () => { await navigator.clipboard.writeText(pack); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  const restart = () => { reset(); onHome(); };
  return <main className="results live-results"><Header compact /><div className="result-wrap">
    <p className="question-eyebrow">Your next move pack</p><h2>One priority. A concrete way forward.</h2>
    <p className="result-intro">This plan is shaped by your objective, evidence, bottleneck, previous attempts, and actual capacity—not a generic feature list.</p>
    <section className="decision-card"><span>CURRENT PRODUCT DECISION</span><h3>Focus on {playbook.focus}.</h3><p>{evidence === "assumption" ? playbook.firstAction : playbook.experiment}.</p></section>
    <div className="insights">
      <article><span>EVIDENCE LEVEL</span><h4>{evidence === "strong" ? "Ready for a focused test" : evidence === "developing" ? "Validate while testing" : "Learn before building"}</h4><p>{answers.evidenceDetail || "No concrete evidence supplied yet."}</p></article>
      <article><span>SUCCESS SIGNAL</span><h4>{answers.successMetric || playbook.defaultMetric}</h4><p>Record a baseline before changing the product.</p></article>
      <article><span>GUARDRAIL</span><h4>Keep the scope narrow</h4><p>{playbook.warning}.</p></article>
    </div>
    <section className="document"><div className="document-bar"><div><span>MARKDOWN · ACTION PLAN + EXPERIMENT + BUILD PROMPT</span><b>{answers.appName || "Live app checkup"}</b></div><div className="document-buttons"><button type="button" onClick={copy}>{copied ? "Copied ✓" : "Copy full pack"}</button><button type="button" onClick={() => downloadMarkdown(pack, answers.appName, "next-move-pack")}>Download .md ↓</button></div></div><pre>{pack}</pre></section>
    <div className="result-actions"><button className="text-button" onClick={onBack}>← Edit answers</button><PrimaryButton onClick={restart}>Start another</PrimaryButton></div>
  </div></main>;
}
