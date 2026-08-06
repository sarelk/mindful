"use client";

import { useMemo, useState } from "react";
import { Header, PrimaryButton } from "./chrome";
import { calculateCompleteness, getMissingInformation } from "@/lib/project";
import { generateSpecification, getGuidance } from "@/lib/specification";
import { useProjectStore } from "@/lib/store";

const SCORE_COPY = [
  { minimum: 80, title: "Strong foundation", detail: "Your project has enough definition to begin planning with confidence." },
  { minimum: 55, title: "Good start", detail: "A few more precise answers will make this much easier to build." },
  { minimum: 0, title: "Keep clarifying", detail: "The open questions below are the best place to continue thinking." },
] as const;

function Insight({ label, items }: { label: string; items: string[] }) {
  return <article><span>{label}</span><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}

export function Results({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  const answers = useProjectStore((state) => state.answers);
  const reset = useProjectStore((state) => state.reset);
  const [copied, setCopied] = useState(false);
  const document = useMemo(() => generateSpecification(answers), [answers]);
  const guidance = useMemo(() => getGuidance(answers), [answers]);
  const score = calculateCompleteness(answers);
  const scoreCopy = SCORE_COPY.find(({ minimum }) => score >= minimum)!;
  const missing = getMissingInformation(answers);
  const risks = [...new Set([...answers.risks, ...guidance.surfacedRisks])];

  const copyDocument = async () => {
    await navigator.clipboard.writeText(document);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const startAnother = () => {
    reset();
    onHome();
  };

  return <main className="results">
    <Header compact />
    <div className="result-wrap">
      <p className="question-eyebrow">Your specification</p>
      <h2>A clearer path forward.</h2>
      <p className="result-intro">You did the thinking. Here is a first engineering brief you can discuss, refine, or build from.</p>
      <section className="score-card">
        <div className="score-ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}><span>{score}<small>%</small></span></div>
        <div><span>SPECIFICATION COMPLETENESS</span><h3>{scoreCopy.title}</h3><p>{scoreCopy.detail}</p></div>
      </section>
      <div className="insights">
        <Insight label="Missing information" items={missing.length ? missing : ["No critical gaps found"]} />
        <Insight label="Possible risks" items={(risks.length ? risks : ["No risks selected—pressure-test assumptions"]).slice(0, 4)} />
        <Insight label="Worth clarifying" items={guidance.clarifications.slice(0, 4)} />
      </div>
      <section className="document">
        <div className="document-bar"><div><span>MARKDOWN SPECIFICATION</span><b>{answers.productName || answers.projectType || "Untitled project"}</b></div><button type="button" onClick={copyDocument}>{copied ? "Copied ✓" : "Copy markdown"}</button></div>
        <pre>{document}</pre>
      </section>
      <div className="result-actions"><button className="text-button" onClick={onBack}>← Edit answers</button><PrimaryButton onClick={startAnother}>Start another</PrimaryButton></div>
    </div>
  </main>;
}
