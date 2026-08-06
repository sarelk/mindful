"use client";

import { useEffect, useMemo, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Answers = {
  productName: string; projectType: string; audience: string; problem: string; currentSolution: string;
  success: string; requirements: string[]; constraints: string[]; risks: string[]; done: string;
};

type Store = {
  answers: Answers;
  setAnswer: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
  reset: () => void;
};

const initialAnswers: Answers = {
  productName: "", projectType: "", audience: "", problem: "", currentSolution: "", success: "",
  requirements: [""], constraints: [], risks: [], done: "",
};

const useProjectStore = create<Store>()(persist((set) => ({
  answers: initialAnswers,
  setAnswer: (key, value) => set((state) => ({ answers: { ...state.answers, [key]: value } })),
  reset: () => set({ answers: initialAnswers }),
}), { name: "mindful-dev-draft" }));

type ChoiceQuestion = {
  key: "projectType" | "audience" | "currentSolution" | "constraints" | "risks";
  title: string; eyebrow: string; explanation: string; examples: string[]; multiple?: boolean;
};

const choiceQuestions: Record<number, ChoiceQuestion> = {
  1: { key: "projectType", eyebrow: "The shape", title: "What are you building?", explanation: "Start with the closest shape you can name. It gives the rest of your decisions a useful boundary.", examples: ["SaaS", "AI Agent", "Mobile App", "API", "Chrome Extension", "Internal Tool", "Marketplace", "Automation", "Website", "CLI", "Other"] },
  2: { key: "audience", eyebrow: "The people", title: "Who is this for?", explanation: "A product for one person makes different promises than a product for thousands. Choose the primary audience.", examples: ["Myself", "Small Team", "Startup", "Enterprise", "Public Users", "Internal Employees", "Other"] },
  4: { key: "currentSolution", eyebrow: "The baseline", title: "How is this solved today?", explanation: "Every problem already has a workaround—even if that workaround is doing nothing. Name the thing you must improve on.", examples: ["Excel", "Manual work", "Email", "Existing software", "No solution", "Other"] },
  7: { key: "constraints", eyebrow: "The boundaries", title: "What must we work within?", explanation: "Constraints are not inconveniences. They are design inputs that make the right solution easier to see.", examples: ["Budget", "Privacy", "Offline", "Open Source", "GDPR", "Time", "Mobile Only", "Web Only", "Other"], multiple: true },
  8: { key: "risks", eyebrow: "The uncertainty", title: "What could make this fail?", explanation: "Naming uncertainty early lets you test the riskiest assumptions before they become expensive.", examples: ["Technical risk", "Business risk", "Legal", "Security", "Scalability", "Unknown", "Other"], multiple: true },
};

const textQuestions = {
  3: { key: "problem" as const, eyebrow: "The problem", title: "What problem are you solving?", explanation: "Describe the friction, not your solution. Who experiences it, when does it happen, and why does it matter?", placeholder: "People who manage small teams lose hours each week collecting status updates across email and chat…", examples: ["Who experiences the problem?", "What happens today?", "Why is that painful?"] },
  5: { key: "success" as const, eyebrow: "The outcome", title: "What does success look like?", explanation: "Describe the change you want to create in observable terms. A strong outcome helps you say no to distractions.", placeholder: "I want users to understand their team’s progress in under two minutes, without asking for updates…", examples: ["I want users to…", "We will know this works when…", "The key behavior change is…"] },
  9: { key: "done" as const, eyebrow: "The finish line", title: "How will you know it’s complete?", explanation: "Define a finish line that another person could verify. This turns an open-ended idea into a shippable first version.", placeholder: "A new user can create an account, invite their team, collect one update, and view a weekly summary…", examples: ["What can a user do end to end?", "What quality bar must it meet?", "What is explicitly not required?"] },
};

function Mark() { return <span className="mark" aria-hidden="true"><i /><i /><i /></span>; }

function Header({ compact = false }: { compact?: boolean }) {
  const [dark, setDark] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  return <header className={compact ? "site-header compact" : "site-header"}>
    <a className="brand" href="#" aria-label="Mindful Dev home"><Mark /><span>mindful<span className="brand-dot">.</span>dev</span></a>
    <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">{dark ? "Light" : "Dark"}<span>◐</span></button>
  </header>;
}

function Landing({ onStart }: { onStart: () => void }) {
  return <main className="landing">
    <Header />
    <section className="hero">
      <div className="hero-copy">
        <p className="kicker"><span />A calmer way to start software projects</p>
        <h1>Think before<br />you <em>build.</em></h1>
        <p className="subhead">A guided framework for turning vague software ideas into structured engineering specifications.</p>
        <p className="support">Most people jump straight into AI and ask it to build something. Mindful Dev helps you understand the problem first, define success, identify constraints, and produce a specification that both humans and AI can build from.</p>
        <div className="hero-actions"><button className="primary" onClick={onStart}>Start thinking <span>→</span></button><button className="text-button" onClick={() => document.getElementById("example")?.scrollIntoView({ behavior: "smooth" })}>See example <span>↘</span></button></div>
        <p className="privacy"><span>✓</span> No account. No AI. Your ideas stay on your device.</p>
      </div>
      <aside className="thought-card" aria-label="How Mindful Dev works">
        <div className="card-top"><span>A thoughtful start</span><span>01 — 09</span></div>
        <blockquote>“The quality of what you build is limited by the clarity of what you understand.”</blockquote>
        <div className="thought-flow">
          <div><span>01</span><p><b>Understand</b><small>The problem &amp; people</small></p></div>
          <div><span>02</span><p><b>Define</b><small>Success &amp; boundaries</small></p></div>
          <div><span>03</span><p><b>Specify</b><small>A plan worth building</small></p></div>
        </div>
      </aside>
    </section>
    <section className="example-strip" id="example"><span>FROM VAGUE IDEA</span><p>“Build me a productivity app”</p><i>→</i><span>TO BUILDABLE SPEC</span><p>Problem, audience, requirements, constraints, risks &amp; milestones</p></section>
    <footer><span>Think first. Build second.</span><span>Mindful Dev · Your ideas, structured.</span></footer>
  </main>;
}

function NameStep() {
  const { answers, setAnswer } = useProjectStore();
  return <QuestionShell eyebrow="A place to begin" title="Does your idea have a name?" explanation="A working name makes an early idea easier to hold onto and discuss. It does not need to be final—and you can leave this blank." examples={[]} hint="Optional working name">
    <input className="name-input" autoFocus value={answers.productName || ""} onChange={e => setAnswer("productName", e.target.value)} placeholder="e.g. Northstar, Quiet Inbox, Project Atlas…" />
    <div className="prompt-notes"><span>Remember:</span><span>· A placeholder is perfectly fine</span><span>· You can rename it later</span></div>
  </QuestionShell>;
}

function ChoiceStep({ data }: { data: ChoiceQuestion }) {
  const { answers, setAnswer } = useProjectStore();
  const current = answers[data.key];
  const selected = Array.isArray(current) ? current : current ? [current] : [];
  const toggle = (item: string) => {
    if (data.multiple) setAnswer(data.key, (selected.includes(item) ? selected.filter(v => v !== item) : [...selected, item]) as never);
    else setAnswer(data.key, item as never);
  };
  return <QuestionShell {...data} hint={data.multiple ? "Choose all that apply" : "Choose the closest fit"}>
    <div className="choice-grid">{data.examples.map((item, i) => <button key={item} className={`choice ${selected.includes(item) ? "selected" : ""}`} onClick={() => toggle(item)}><span>{String(i + 1).padStart(2, "0")}</span>{item}<b>{selected.includes(item) ? "✓" : ""}</b></button>)}</div>
    {selected.includes("Other") && <input className="other-input" aria-label="Other answer" placeholder="Tell us what fits better…" />}
  </QuestionShell>;
}

function TextStep({ step }: { step: 3 | 5 | 9 }) {
  const data = textQuestions[step]; const { answers, setAnswer } = useProjectStore();
  return <QuestionShell {...data} hint="Write in your own words">
    <textarea autoFocus value={answers[data.key]} onChange={e => setAnswer(data.key, e.target.value)} placeholder={data.placeholder} />
    <div className="prompt-notes"><span>Consider:</span>{data.examples.map(x => <span key={x}>· {x}</span>)}</div>
  </QuestionShell>;
}

function RequirementsStep() {
  const { answers, setAnswer } = useProjectStore();
  const update = (i: number, value: string) => { const next = [...answers.requirements]; next[i] = value; setAnswer("requirements", next); };
  return <QuestionShell eyebrow="The behavior" title="What must it do?" explanation="List the essential actions your first version must support. Start each requirement with a user or system behavior." examples={[]} hint="One requirement per line">
    <div className="requirements">{answers.requirements.map((req, i) => <div className="requirement" key={i}><span>{String(i + 1).padStart(2, "0")}</span><input autoFocus={i === 0} value={req} onChange={e => update(i, e.target.value)} placeholder={i === 0 ? "Users can create and organize projects" : "Add another requirement"}/>{answers.requirements.length > 1 && <button onClick={() => setAnswer("requirements", answers.requirements.filter((_, x) => x !== i))} aria-label="Remove requirement">×</button>}</div>)}</div>
    <button className="add-button" onClick={() => setAnswer("requirements", [...answers.requirements, ""])}>+ Add requirement</button>
    <div className="prompt-notes"><span>Good examples:</span><span>· Users can sign in</span><span>· Users receive notifications</span><span>· Users upload files</span></div>
  </QuestionShell>;
}

function QuestionShell({ eyebrow, title, explanation, hint, children }: { eyebrow: string; title: string; explanation: string; examples: string[]; hint: string; children: React.ReactNode }) {
  return <div className="question"><p className="question-eyebrow">{eyebrow}</p><h2>{title}</h2><p className="question-explanation">{explanation}</p><div className="answer-label"><span>{hint}</span><span>Optional notes are welcome</span></div>{children}</div>;
}

type Guidance = { summary: string; nonGoals: string[]; milestones: string[]; improvements: string[]; clarifications: string[]; surfacedRisks: string[] };

function guidanceFor(a: Answers): Guidance {
  const kind = a.projectType || "Software project";
  const audience = a.audience || "an audience still to be defined";
  const base: Guidance = {
    summary: `${a.productName ? `${a.productName} is` : "This project is"} a ${kind.toLowerCase()} for ${audience.toLowerCase()}, intended to ${a.success ? a.success.charAt(0).toLowerCase() + a.success.slice(1) : "solve a problem that still needs a measurable outcome"}.`,
    nonGoals: ["Features outside the first complete user journey", "Integrations that are not required to prove the core value"],
    milestones: ["Validate the problem with representative users", "Prototype the riskiest workflow", "Build one complete end-to-end path", "Test against the definition of done", "Prepare a small, observable release"],
    improvements: ["Add capabilities requested by validated users", "Automate repeated work discovered after launch"],
    clarifications: ["Which requirement proves value fastest?", "What is explicitly out of scope for the first release?"],
    surfacedRisks: [],
  };
  switch (a.projectType) {
    case "Marketplace": base.nonGoals.push("Supporting every participant category at launch", "Advanced ranking before supply and demand are validated"); base.milestones = ["Choose one narrow market and validate both sides", "Recruit initial supply before opening demand", "Test discovery and matching manually", "Build the first transaction or connection loop", "Measure liquidity, trust, and repeat usage"]; base.improvements.push("Reputation and trust signals", "Matching, payments, disputes, and marketplace analytics"); base.clarifications.push("Who is the supply side and who is the demand side?", "What creates enough trust for the first transaction?", "How will the marketplace solve the cold-start problem?"); base.surfacedRisks.push("A two-sided marketplace can fail when either supply or demand is too thin", "Trust, moderation, and disputes may become core product requirements"); break;
    case "SaaS": base.nonGoals.push("Multiple pricing tiers before willingness to pay is validated", "Enterprise administration in the first release"); base.milestones = ["Validate the recurring pain and willingness to pay", "Prototype the core recurring workflow", "Build onboarding and the primary value loop", "Add basic billing readiness and usage measurement", "Release to a small customer cohort"]; base.improvements.push("Billing and plan management", "Team roles, integrations, and retention reporting"); base.clarifications.push("What recurring behavior makes this a service rather than a one-time tool?", "What event represents activation?"); break;
    case "AI Agent": base.nonGoals.push("Fully autonomous high-impact actions", "Supporting every model or tool provider"); base.milestones = ["Define one bounded job and its evaluation set", "Prototype the human-in-the-loop workflow", "Measure accuracy, failure modes, and cost", "Add permissions, auditability, and recovery", "Pilot with supervised users"]; base.improvements.push("Broader tool access after reliability is proven", "Evaluation dashboards and model fallback strategies"); base.surfacedRisks.push("Model output can be inconsistent even when inputs are similar", "Autonomous actions require permissions, audit logs, and safe recovery"); break;
    case "Mobile App": base.nonGoals.push("Perfect feature parity across every device", "Tablet-specific layouts unless essential"); base.milestones = ["Validate the mobile moment and primary task", "Prototype navigation on a real device", "Build the core flow with local state", "Test permissions, interruptions, and poor connectivity", "Beta test on target devices"]; base.improvements.push("Push notifications where they create real value", "Accessibility and device-specific refinements"); base.clarifications.push("Why must this experience be mobile?", "Which device permissions are truly necessary?"); break;
    case "API": base.nonGoals.push("A graphical interface beyond documentation and testing", "Premature support for multiple API paradigms"); base.milestones = ["Define consumers and core resource model", "Write the contract and failure semantics", "Implement one versioned happy path", "Add authentication, limits, logs, and tests", "Publish documentation and a reference integration"]; base.improvements.push("SDKs for validated client languages", "Usage analytics, webhooks, and developer tooling"); base.surfacedRisks.push("Breaking contracts can create high migration costs for consumers"); break;
    case "Chrome Extension": base.nonGoals.push("Support for every browser in the first release", "Broad access to browsing data without a proven need"); base.milestones = ["Validate the browser-context workflow", "Prototype content and popup interactions", "Minimize and document permissions", "Build and test across representative pages", "Prepare store listing and review materials"]; base.improvements.push("Additional browser support", "Sync and organization across devices"); break;
    case "Internal Tool": base.nonGoals.push("Public-user onboarding and marketing features", "Replacing every adjacent internal system"); base.milestones = ["Map the current process with operators", "Identify the highest-cost manual handoff", "Prototype with real internal data", "Build roles, auditability, and the core workflow", "Pilot with one team and measure time saved"]; base.improvements.push("Additional team workflows", "Operational reporting and approved integrations"); break;
    case "Automation": base.nonGoals.push("Automating exceptions before the normal path is stable", "Removing human approval from irreversible actions"); base.milestones = ["Document the current trigger, steps, and exceptions", "Measure the manual baseline", "Automate one reversible path", "Add retries, alerts, and human fallback", "Run in parallel before full cutover"]; base.surfacedRisks.push("Silent automation failures can be worse than visible manual work"); break;
    case "Website": base.nonGoals.push("Application workflows not required by the content goal", "A complex content system before publishing needs are known"); base.milestones = ["Define the primary visitor action", "Create the content hierarchy", "Prototype the key responsive pages", "Build with accessibility and performance budgets", "Validate analytics and launch readiness"]; base.improvements.push("Content experiments informed by visitor behavior", "Search and richer editorial tools"); break;
    case "CLI": base.nonGoals.push("A graphical interface", "Supporting every operating system before the command model is stable"); base.milestones = ["Define commands, inputs, outputs, and exit codes", "Prototype the primary command", "Add safe defaults and actionable errors", "Test scripting and cross-platform behavior", "Package documentation and releases"]; base.improvements.push("Shell completion and richer output formats", "Plugin or configuration support"); break;
  }
  if (a.audience === "Enterprise") { base.nonGoals.push("Custom deployment models before demand is confirmed"); base.clarifications.push("Which roles, approvals, audit records, and procurement requirements apply?"); base.surfacedRisks.push("Enterprise adoption may depend on security review, access controls, and compliance evidence"); }
  if (a.audience === "Myself") { base.nonGoals.push("Multi-user permissions before personal value is proven"); base.milestones[0] = "Observe and measure your current workflow for one week"; }
  if (a.audience === "Public Users") { base.clarifications.push("How will abuse, accessibility, support, and moderation be handled?"); base.surfacedRisks.push("Public access increases abuse, support, privacy, and accessibility obligations"); }
  if (a.currentSolution === "Excel") { base.improvements.push("Structured import and export for existing spreadsheets"); base.clarifications.push("Which spreadsheet flexibility must be preserved?"); }
  if (a.currentSolution === "Manual work") base.milestones.splice(1, 0, "Measure the manual baseline: time, errors, and handoffs");
  if (a.currentSolution === "Existing software") base.clarifications.push("Why will users switch, and what migration cost must be overcome?");
  if (a.currentSolution === "No solution") base.surfacedRisks.push("No current solution may signal an unproven need rather than an open market");
  if (a.constraints.includes("Offline")) { base.nonGoals.push("Real-time collaboration while disconnected"); base.milestones.splice(-1, 0, "Test sync conflicts, recovery, and offline data integrity"); base.surfacedRisks.push("Offline data needs explicit sync and conflict-resolution rules"); }
  if (a.constraints.includes("Privacy")) { base.milestones.splice(2, 0, "Map sensitive data and minimize collection"); base.surfacedRisks.push("Sensitive data handling requires retention, deletion, and access policies"); }
  if (a.constraints.includes("GDPR")) { base.nonGoals.push("Collecting personal data without a documented purpose"); base.clarifications.push("What is the lawful basis, retention period, and deletion workflow?"); }
  if (a.constraints.includes("Budget")) base.nonGoals.push("Infrastructure and vendors that are not justified by early usage");
  if (a.constraints.includes("Time")) { base.nonGoals.push("Secondary workflows that delay the first usable release"); base.milestones = base.milestones.slice(0, 4); }
  if (a.risks.includes("Security")) base.milestones.splice(-1, 0, "Threat-model sensitive flows and test access boundaries");
  if (a.risks.includes("Scalability")) { base.surfacedRisks.push("Scale targets are undefined until expected users, data volume, and peak load are stated"); base.clarifications.push("What load must the first version handle, and what can be deferred?"); }
  if (a.risks.includes("Legal")) base.milestones.splice(1, 0, "Validate the legal model before implementation");
  return { ...base, nonGoals: [...new Set(base.nonGoals)], milestones: [...new Set(base.milestones)].slice(0, 7), improvements: [...new Set(base.improvements)], clarifications: [...new Set(base.clarifications)], surfacedRisks: [...new Set(base.surfacedRisks)] };
}

function markdown(a: Answers) {
  const g = guidanceFor(a);
  const reqs = a.requirements.filter(Boolean).map(x => `- ${x}`).join("\n") || "- To be defined";
  const list = (x: string[]) => x.length ? x.map(v => `- ${v}`).join("\n") : "- None identified yet";
  return `# ${a.productName || a.projectType || "Untitled Project"} — Engineering Specification\n\n## Executive Summary\n${g.summary}\n\n## Problem Statement\n${a.problem || "To be clarified."}\n\n## Target Audience\n${a.audience || "To be clarified."}\n\n## Current Alternatives\n${a.currentSolution || "To be researched."}\n\n## Goals\n${a.success || "A measurable success outcome has not been defined yet."}\n\n## Non Goals\n${list(g.nonGoals)}\n\n## Functional Requirements\n${reqs}\n\n## Constraints\n${list(a.constraints)}\n\n## Risks\n${list([...a.risks, ...g.surfacedRisks])}\n\n## Definition of Done\n${a.done || "A verifiable finish line has not been defined yet."}\n\n## Suggested Milestones\n${g.milestones.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\n## Future Improvements\n${list(g.improvements)}\n\n## Things Worth Clarifying\n${list(g.clarifications)}`;
}

function Results({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  const { answers } = useProjectStore(); const [copied, setCopied] = useState(false);
  const guidance = guidanceFor(answers);
  const fields = [answers.projectType, answers.audience, answers.problem, answers.currentSolution, answers.success, answers.requirements.some(Boolean), answers.constraints.length, answers.risks.length, answers.done];
  const score = Math.round(fields.filter(Boolean).length / fields.length * 100); const doc = useMemo(() => markdown(answers), [answers]);
  const missing = [!answers.problem && "A precise problem statement", !answers.success && "A measurable success outcome", !answers.done && "A verifiable finish line"].filter(Boolean) as string[];
  return <main className="results"><Header compact /><div className="result-wrap"><p className="question-eyebrow">Your specification</p><h2>A clearer path forward.</h2><p className="result-intro">You did the thinking. Here is a first engineering brief you can discuss, refine, or build from.</p>
    <section className="score-card"><div className="score-ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}><span>{score}<small>%</small></span></div><div><span>SPECIFICATION COMPLETENESS</span><h3>{score >= 80 ? "Strong foundation" : score >= 55 ? "Good start" : "Keep clarifying"}</h3><p>{score >= 80 ? "Your project has enough definition to begin planning with confidence." : "A few more precise answers will make this much easier to build."}</p></div></section>
    <div className="insights"><article><span>Missing information</span><ul>{(missing.length ? missing : ["No critical gaps found"]).map(x => <li key={x}>{x}</li>)}</ul></article><article><span>Possible risks</span><ul>{([...answers.risks, ...guidance.surfacedRisks].length ? [...answers.risks, ...guidance.surfacedRisks] : ["No risks selected—pressure-test assumptions"]).slice(0, 4).map(x => <li key={x}>{x}</li>)}</ul></article><article><span>Worth clarifying</span><ul>{guidance.clarifications.slice(0, 4).map(x => <li key={x}>{x}</li>)}</ul></article></div>
    <section className="document"><div className="document-bar"><div><span>MARKDOWN SPECIFICATION</span><b>{answers.productName || answers.projectType || "Untitled project"}</b></div><button onClick={async () => { await navigator.clipboard.writeText(doc); setCopied(true); setTimeout(() => setCopied(false), 1600); }}>{copied ? "Copied ✓" : "Copy markdown"}</button></div><pre>{doc}</pre></section>
    <div className="result-actions"><button className="text-button" onClick={onBack}>← Edit answers</button><button className="primary" onClick={onHome}>Start another <span>→</span></button></div></div></main>;
}

function Wizard({ onExit }: { onExit: () => void }) {
  const [step, setStep] = useState(0); const { answers } = useProjectStore();
  const canNext = step === 0 ? true : step === 1 ? !!answers.projectType : step === 2 ? !!answers.audience : step === 3 ? !!answers.problem.trim() : step === 4 ? !!answers.currentSolution : step === 5 ? !!answers.success.trim() : step === 6 ? answers.requirements.some(Boolean) : step === 9 ? !!answers.done.trim() : true;
  useEffect(() => { const key = (e: KeyboardEvent) => { if (e.key === "Escape" && step > 0) setStep(s => s - 1); if (e.key === "Enter" && !e.shiftKey && (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) && canNext) { e.preventDefault(); setStep(s => Math.min(10, s + 1)); } }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, [step, canNext]);
  if (step === 10) return <Results onBack={() => setStep(9)} onHome={onExit} />;
  return <main className="wizard"><Header compact /><div className="progress-wrap"><div className="progress-meta"><span>YOUR PROJECT BRIEF</span><span>{String(step + 1).padStart(2, "0")} <i>/</i> 10</span></div><div className="progress-track"><i style={{ width: `${(step + 1) / 10 * 100}%` }} /></div></div>
    <section className="wizard-body">{step === 0 ? <NameStep /> : choiceQuestions[step] ? <ChoiceStep data={choiceQuestions[step]} /> : step === 6 ? <RequirementsStep /> : <TextStep step={step as 3 | 5 | 9} />}</section>
    <nav className="wizard-nav"><button className="back" onClick={() => step === 0 ? onExit() : setStep(step - 1)}>← Back</button><span className="saved">✓ Draft saved locally</span><div className="nav-actions">{step > 0 && <button className="skip" onClick={() => setStep(step + 1)}>Not sure yet · Skip</button>}<button className="primary" disabled={!canNext} onClick={() => setStep(step + 1)}>{step === 9 ? "Generate specification" : "Continue"} <span>→</span></button></div></nav>
  </main>;
}

export default function Home() { const [started, setStarted] = useState(false); return started ? <Wizard onExit={() => setStarted(false)} /> : <Landing onStart={() => setStarted(true)} />; }
