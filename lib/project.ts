export const PROJECT_TYPES = ["SaaS", "AI Agent", "Mobile App", "API", "Chrome Extension", "Internal Tool", "Marketplace", "Automation", "Website", "CLI", "Other"] as const;
export const AUDIENCES = ["Myself", "Small Team", "Startup", "Enterprise", "Public Users", "Internal Employees", "Other"] as const;
export const CURRENT_SOLUTIONS = ["Excel", "Manual work", "Email", "Existing software", "No solution", "Other"] as const;
export const CONSTRAINTS = ["Budget", "Privacy", "Offline", "Open Source", "GDPR", "Time", "Mobile Only", "Web Only", "Other"] as const;
export const RISKS = ["Technical risk", "Business risk", "Legal", "Security", "Scalability", "Unknown", "Other"] as const;

export type ProjectAnswers = {
  productName: string;
  projectType: string;
  audience: string;
  problem: string;
  currentSolution: string;
  success: string;
  requirements: string[];
  constraints: string[];
  risks: string[];
  done: string;
};

export const INITIAL_ANSWERS: ProjectAnswers = {
  productName: "",
  projectType: "",
  audience: "",
  problem: "",
  currentSolution: "",
  success: "",
  requirements: [""],
  constraints: [],
  risks: [],
  done: "",
};

export const COMPLETENESS_FIELDS = [
  (a: ProjectAnswers) => Boolean(a.projectType),
  (a: ProjectAnswers) => Boolean(a.audience),
  (a: ProjectAnswers) => Boolean(a.problem.trim()),
  (a: ProjectAnswers) => Boolean(a.currentSolution),
  (a: ProjectAnswers) => Boolean(a.success.trim()),
  (a: ProjectAnswers) => a.requirements.some(Boolean),
  (a: ProjectAnswers) => a.constraints.length > 0,
  (a: ProjectAnswers) => a.risks.length > 0,
  (a: ProjectAnswers) => Boolean(a.done.trim()),
] as const;

export function calculateCompleteness(answers: ProjectAnswers): number {
  const completed = COMPLETENESS_FIELDS.filter((check) => check(answers)).length;
  return Math.round((completed / COMPLETENESS_FIELDS.length) * 100);
}

export function getMissingInformation(answers: ProjectAnswers): string[] {
  return [
    !answers.problem.trim() && "A precise problem statement",
    !answers.success.trim() && "A measurable success outcome",
    !answers.done.trim() && "A verifiable finish line",
  ].filter((value): value is string => Boolean(value));
}
