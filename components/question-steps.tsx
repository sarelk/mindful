"use client";

import type { ChoiceQuestion, QuestionContent, TextQuestion, WizardQuestion } from "@/lib/questions";
import { useProjectStore } from "@/lib/store";

function QuestionShell({ question, hint, children }: { question: QuestionContent; hint: string; children: React.ReactNode }) {
  return (
    <div className="question">
      <p className="question-eyebrow">{question.eyebrow}</p>
      <h2>{question.title}</h2>
      <p className="question-explanation">{question.explanation}</p>
      <div className="answer-label"><span>{hint}</span><span>Optional notes are welcome</span></div>
      {children}
    </div>
  );
}

function NameStep({ question }: { question: QuestionContent }) {
  const { answers, setAnswer } = useProjectStore();
  return <QuestionShell question={question} hint="Optional working name">
    <input className="name-input" value={answers.productName} onChange={(event) => setAnswer("productName", event.target.value)} placeholder="e.g. Northstar, Quiet Inbox, Project Atlas…" />
    <PromptNotes label="Remember" prompts={["A placeholder is perfectly fine", "You can rename it later"]} />
  </QuestionShell>;
}

function ChoiceStep({ question }: { question: ChoiceQuestion }) {
  const { answers, setAnswer } = useProjectStore();
  const current = answers[question.key];
  const selected = Array.isArray(current) ? current : current ? [current] : [];
  const toggle = (option: string) => {
    if (question.multiple) {
      const value = selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option];
      setAnswer(question.key, value as never);
    } else setAnswer(question.key, option as never);
  };
  return <QuestionShell question={question} hint={question.multiple ? "Choose all that apply" : "Choose the closest fit"}>
    <div className="choice-grid">
      {question.options.map((option, index) => <button type="button" key={option} className={`choice${selected.includes(option) ? " selected" : ""}`} aria-pressed={selected.includes(option)} onClick={() => toggle(option)}><span>{String(index + 1).padStart(2, "0")}</span>{option}<b>{selected.includes(option) ? "✓" : ""}</b></button>)}
    </div>
    {selected.includes("Other") && <input className="other-input" aria-label="Other answer" placeholder="Tell us what fits better…" />}
  </QuestionShell>;
}

function TextStep({ question }: { question: TextQuestion }) {
  const { answers, setAnswer } = useProjectStore();
  return <QuestionShell question={question} hint="Write in your own words">
    <textarea value={answers[question.key]} onChange={(event) => setAnswer(question.key, event.target.value)} placeholder={question.placeholder} />
    <PromptNotes label="Consider" prompts={question.prompts} />
  </QuestionShell>;
}

function RequirementsStep({ question }: { question: QuestionContent }) {
  const { answers, setAnswer } = useProjectStore();
  const update = (index: number, value: string) => setAnswer("requirements", answers.requirements.map((item, itemIndex) => itemIndex === index ? value : item));
  const remove = (index: number) => setAnswer("requirements", answers.requirements.filter((_, itemIndex) => itemIndex !== index));
  return <QuestionShell question={question} hint="One requirement per line">
    <div className="requirements">
      {answers.requirements.map((requirement, index) => <div className="requirement" key={index}><span>{String(index + 1).padStart(2, "0")}</span><input value={requirement} onChange={(event) => update(index, event.target.value)} placeholder={index === 0 ? "Users can create and organize projects" : "Add another requirement"}/>{answers.requirements.length > 1 && <button type="button" onClick={() => remove(index)} aria-label={`Remove requirement ${index + 1}`}>×</button>}</div>)}
    </div>
    <button type="button" className="add-button" onClick={() => setAnswer("requirements", [...answers.requirements, ""])}>+ Add requirement</button>
    <PromptNotes label="Good examples" prompts={["Users can sign in", "Users receive notifications", "Users upload files"]} />
  </QuestionShell>;
}

function PromptNotes({ label, prompts }: { label: string; prompts: readonly string[] }) {
  return <div className="prompt-notes"><span>{label}:</span>{prompts.map((prompt) => <span key={prompt}>· {prompt}</span>)}</div>;
}

export function QuestionStep({ question }: { question: WizardQuestion }) {
  switch (question.kind) {
    case "name": return <NameStep question={question} />;
    case "choice": return <ChoiceStep question={question} />;
    case "text": return <TextStep question={question} />;
    case "requirements": return <RequirementsStep question={question} />;
  }
}
