import { AUDIENCES, CONSTRAINTS, CURRENT_SOLUTIONS, PROJECT_TYPES, RISKS, type ProjectAnswers } from "./project";

export const LAST_QUESTION_STEP = 9;
export const RESULT_STEP = 10;
export const TOTAL_STEPS = 10;

export type QuestionContent = {
  eyebrow: string;
  title: string;
  explanation: string;
};

export type ChoiceQuestion = QuestionContent & {
  kind: "choice";
  key: "projectType" | "audience" | "currentSolution" | "constraints" | "risks";
  options: readonly string[];
  multiple?: boolean;
};

export type TextQuestion = QuestionContent & {
  kind: "text";
  key: "problem" | "success" | "done";
  placeholder: string;
  prompts: readonly string[];
};

export type WizardQuestion = ChoiceQuestion | TextQuestion | (QuestionContent & { kind: "name" | "requirements" });

export const QUESTIONS: readonly WizardQuestion[] = [
  { kind: "name", eyebrow: "A place to begin", title: "Does your idea have a name?", explanation: "A working name makes an early idea easier to hold onto and discuss. It does not need to be final—and you can leave this blank." },
  { kind: "choice", key: "projectType", eyebrow: "The shape", title: "What are you building?", explanation: "Start with the closest shape you can name. It gives the rest of your decisions a useful boundary.", options: PROJECT_TYPES },
  { kind: "choice", key: "audience", eyebrow: "The people", title: "Who is this for?", explanation: "A product for one person makes different promises than a product for thousands. Choose the primary audience.", options: AUDIENCES },
  { kind: "text", key: "problem", eyebrow: "The problem", title: "What problem are you solving?", explanation: "Describe the friction, not your solution. Who experiences it, when does it happen, and why does it matter?", placeholder: "People who manage small teams lose hours each week collecting status updates across email and chat…", prompts: ["Who experiences the problem?", "What happens today?", "Why is that painful?"] },
  { kind: "choice", key: "currentSolution", eyebrow: "The baseline", title: "How is this solved today?", explanation: "Every problem already has a workaround—even if that workaround is doing nothing. Name the thing you must improve on.", options: CURRENT_SOLUTIONS },
  { kind: "text", key: "success", eyebrow: "The outcome", title: "What does success look like?", explanation: "Describe the change you want to create in observable terms. A strong outcome helps you say no to distractions.", placeholder: "I want users to understand their team’s progress in under two minutes, without asking for updates…", prompts: ["I want users to…", "We will know this works when…", "The key behavior change is…"] },
  { kind: "requirements", eyebrow: "The behavior", title: "What must it do?", explanation: "List the essential actions your first version must support. Start each requirement with a user or system behavior." },
  { kind: "choice", key: "constraints", eyebrow: "The boundaries", title: "What must we work within?", explanation: "Constraints are not inconveniences. They are design inputs that make the right solution easier to see.", options: CONSTRAINTS, multiple: true },
  { kind: "choice", key: "risks", eyebrow: "The uncertainty", title: "What could make this fail?", explanation: "Naming uncertainty early lets you test the riskiest assumptions before they become expensive.", options: RISKS, multiple: true },
  { kind: "text", key: "done", eyebrow: "The finish line", title: "How will you know it’s complete?", explanation: "Define a finish line that another person could verify. This turns an open-ended idea into a shippable first version.", placeholder: "A new user can create an account, invite their team, collect one update, and view a weekly summary…", prompts: ["What can a user do end to end?", "What quality bar must it meet?", "What is explicitly not required?"] },
] as const;

const REQUIRED_BY_STEP: Partial<Record<number, (answers: ProjectAnswers) => boolean>> = {
  1: (a) => Boolean(a.projectType), 2: (a) => Boolean(a.audience), 3: (a) => Boolean(a.problem.trim()),
  4: (a) => Boolean(a.currentSolution), 5: (a) => Boolean(a.success.trim()),
  6: (a) => a.requirements.some(Boolean), 9: (a) => Boolean(a.done.trim()),
};

export function canContinue(step: number, answers: ProjectAnswers): boolean {
  return REQUIRED_BY_STEP[step]?.(answers) ?? true;
}
