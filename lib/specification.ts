import type { ProjectAnswers } from "./project";

export type Guidance = {
  summary: string;
  nonGoals: string[];
  milestones: string[];
  improvements: string[];
  clarifications: string[];
  surfacedRisks: string[];
};

type GuidancePatch = Partial<Omit<Guidance, "summary">>;
type ContextRule = { matches: (answers: ProjectAnswers) => boolean; patch: GuidancePatch };

const PROJECT_GUIDANCE: Record<string, GuidancePatch> = {
  Marketplace: {
    nonGoals: ["Supporting every participant category at launch", "Advanced ranking before supply and demand are validated"],
    milestones: ["Choose one narrow market and validate both sides", "Recruit initial supply before opening demand", "Test discovery and matching manually", "Build the first transaction or connection loop", "Measure liquidity, trust, and repeat usage"],
    improvements: ["Reputation and trust signals", "Matching, payments, disputes, and marketplace analytics"],
    clarifications: ["Who is the supply side and who is the demand side?", "What creates enough trust for the first transaction?", "How will the marketplace solve the cold-start problem?"],
    surfacedRisks: ["A two-sided marketplace can fail when either supply or demand is too thin", "Trust, moderation, and disputes may become core product requirements"],
  },
  SaaS: {
    nonGoals: ["Multiple pricing tiers before willingness to pay is validated", "Enterprise administration in the first release"],
    milestones: ["Validate the recurring pain and willingness to pay", "Prototype the core recurring workflow", "Build onboarding and the primary value loop", "Add basic billing readiness and usage measurement", "Release to a small customer cohort"],
    improvements: ["Billing and plan management", "Team roles, integrations, and retention reporting"],
    clarifications: ["What recurring behavior makes this a service rather than a one-time tool?", "What event represents activation?"],
  },
  "AI Agent": {
    nonGoals: ["Fully autonomous high-impact actions", "Supporting every model or tool provider"],
    milestones: ["Define one bounded job and its evaluation set", "Prototype the human-in-the-loop workflow", "Measure accuracy, failure modes, and cost", "Add permissions, auditability, and recovery", "Pilot with supervised users"],
    improvements: ["Broader tool access after reliability is proven", "Evaluation dashboards and model fallback strategies"],
    surfacedRisks: ["Model output can be inconsistent even when inputs are similar", "Autonomous actions require permissions, audit logs, and safe recovery"],
  },
  "Mobile App": {
    nonGoals: ["Perfect feature parity across every device", "Tablet-specific layouts unless essential"],
    milestones: ["Validate the mobile moment and primary task", "Prototype navigation on a real device", "Build the core flow with local state", "Test permissions, interruptions, and poor connectivity", "Beta test on target devices"],
    improvements: ["Push notifications where they create real value", "Accessibility and device-specific refinements"],
    clarifications: ["Why must this experience be mobile?", "Which device permissions are truly necessary?"],
  },
  API: {
    nonGoals: ["A graphical interface beyond documentation and testing", "Premature support for multiple API paradigms"],
    milestones: ["Define consumers and core resource model", "Write the contract and failure semantics", "Implement one versioned happy path", "Add authentication, limits, logs, and tests", "Publish documentation and a reference integration"],
    improvements: ["SDKs for validated client languages", "Usage analytics, webhooks, and developer tooling"],
    surfacedRisks: ["Breaking contracts can create high migration costs for consumers"],
  },
  "Chrome Extension": {
    nonGoals: ["Support for every browser in the first release", "Broad access to browsing data without a proven need"],
    milestones: ["Validate the browser-context workflow", "Prototype content and popup interactions", "Minimize and document permissions", "Build and test across representative pages", "Prepare store listing and review materials"],
    improvements: ["Additional browser support", "Sync and organization across devices"],
  },
  "Internal Tool": {
    nonGoals: ["Public-user onboarding and marketing features", "Replacing every adjacent internal system"],
    milestones: ["Map the current process with operators", "Identify the highest-cost manual handoff", "Prototype with real internal data", "Build roles, auditability, and the core workflow", "Pilot with one team and measure time saved"],
    improvements: ["Additional team workflows", "Operational reporting and approved integrations"],
  },
  Automation: {
    nonGoals: ["Automating exceptions before the normal path is stable", "Removing human approval from irreversible actions"],
    milestones: ["Document the current trigger, steps, and exceptions", "Measure the manual baseline", "Automate one reversible path", "Add retries, alerts, and human fallback", "Run in parallel before full cutover"],
    surfacedRisks: ["Silent automation failures can be worse than visible manual work"],
  },
  Website: {
    nonGoals: ["Application workflows not required by the content goal", "A complex content system before publishing needs are known"],
    milestones: ["Define the primary visitor action", "Create the content hierarchy", "Prototype the key responsive pages", "Build with accessibility and performance budgets", "Validate analytics and launch readiness"],
    improvements: ["Content experiments informed by visitor behavior", "Search and richer editorial tools"],
  },
  CLI: {
    nonGoals: ["A graphical interface", "Supporting every operating system before the command model is stable"],
    milestones: ["Define commands, inputs, outputs, and exit codes", "Prototype the primary command", "Add safe defaults and actionable errors", "Test scripting and cross-platform behavior", "Package documentation and releases"],
    improvements: ["Shell completion and richer output formats", "Plugin or configuration support"],
  },
};

const CONTEXT_RULES: ContextRule[] = [
  { matches: (a) => a.audience === "Enterprise", patch: { nonGoals: ["Custom deployment models before demand is confirmed"], clarifications: ["Which roles, approvals, audit records, and procurement requirements apply?"], surfacedRisks: ["Enterprise adoption may depend on security review, access controls, and compliance evidence"] } },
  { matches: (a) => a.audience === "Myself", patch: { nonGoals: ["Multi-user permissions before personal value is proven"], milestones: ["Observe and measure your current workflow for one week"] } },
  { matches: (a) => a.audience === "Public Users", patch: { clarifications: ["How will abuse, accessibility, support, and moderation be handled?"], surfacedRisks: ["Public access increases abuse, support, privacy, and accessibility obligations"] } },
  { matches: (a) => a.currentSolution === "Excel", patch: { improvements: ["Structured import and export for existing spreadsheets"], clarifications: ["Which spreadsheet flexibility must be preserved?"] } },
  { matches: (a) => a.currentSolution === "Manual work", patch: { milestones: ["Measure the manual baseline: time, errors, and handoffs"] } },
  { matches: (a) => a.currentSolution === "Existing software", patch: { clarifications: ["Why will users switch, and what migration cost must be overcome?"] } },
  { matches: (a) => a.currentSolution === "No solution", patch: { surfacedRisks: ["No current solution may signal an unproven need rather than an open market"] } },
  { matches: (a) => a.constraints.includes("Offline"), patch: { nonGoals: ["Real-time collaboration while disconnected"], milestones: ["Test sync conflicts, recovery, and offline data integrity"], surfacedRisks: ["Offline data needs explicit sync and conflict-resolution rules"] } },
  { matches: (a) => a.constraints.includes("Privacy"), patch: { milestones: ["Map sensitive data and minimize collection"], surfacedRisks: ["Sensitive data handling requires retention, deletion, and access policies"] } },
  { matches: (a) => a.constraints.includes("GDPR"), patch: { nonGoals: ["Collecting personal data without a documented purpose"], clarifications: ["What is the lawful basis, retention period, and deletion workflow?"] } },
  { matches: (a) => a.constraints.includes("Budget"), patch: { nonGoals: ["Infrastructure and vendors that are not justified by early usage"] } },
  { matches: (a) => a.constraints.includes("Time"), patch: { nonGoals: ["Secondary workflows that delay the first usable release"] } },
  { matches: (a) => a.risks.includes("Security"), patch: { milestones: ["Threat-model sensitive flows and test access boundaries"] } },
  { matches: (a) => a.risks.includes("Scalability"), patch: { surfacedRisks: ["Scale targets are undefined until expected users, data volume, and peak load are stated"], clarifications: ["What load must the first version handle, and what can be deferred?"] } },
  { matches: (a) => a.risks.includes("Legal"), patch: { milestones: ["Validate the legal model before implementation"] } },
];

const unique = (values: string[]) => [...new Set(values)];

function mergeGuidance(base: Guidance, patch: GuidancePatch, replaceMilestones = false): Guidance {
  return {
    ...base,
    nonGoals: unique([...base.nonGoals, ...(patch.nonGoals ?? [])]),
    milestones: unique(replaceMilestones && patch.milestones ? patch.milestones : [...base.milestones, ...(patch.milestones ?? [])]),
    improvements: unique([...base.improvements, ...(patch.improvements ?? [])]),
    clarifications: unique([...base.clarifications, ...(patch.clarifications ?? [])]),
    surfacedRisks: unique([...base.surfacedRisks, ...(patch.surfacedRisks ?? [])]),
  };
}

export function getGuidance(answers: ProjectAnswers): Guidance {
  const kind = answers.projectType || "Software project";
  const audience = answers.audience || "an audience still to be defined";
  let guidance: Guidance = {
    summary: `${answers.productName ? `${answers.productName} is` : "This project is"} a ${kind.toLowerCase()} for ${audience.toLowerCase()}, intended to ${answers.success ? answers.success.charAt(0).toLowerCase() + answers.success.slice(1) : "solve a problem that still needs a measurable outcome"}.`,
    nonGoals: ["Features outside the first complete user journey", "Integrations that are not required to prove the core value"],
    milestones: ["Validate the problem with representative users", "Prototype the riskiest workflow", "Build one complete end-to-end path", "Test against the definition of done", "Prepare a small, observable release"],
    improvements: ["Add capabilities requested by validated users", "Automate repeated work discovered after launch"],
    clarifications: ["Which requirement proves value fastest?", "What is explicitly out of scope for the first release?"],
    surfacedRisks: [],
  };
  const projectPatch = PROJECT_GUIDANCE[answers.projectType];
  if (projectPatch) guidance = mergeGuidance(guidance, projectPatch, true);
  for (const rule of CONTEXT_RULES) if (rule.matches(answers)) guidance = mergeGuidance(guidance, rule.patch);
  if (answers.constraints.includes("Time")) guidance.milestones = guidance.milestones.slice(0, 4);
  return { ...guidance, milestones: guidance.milestones.slice(0, 7) };
}

const asList = (items: string[], fallback = "None identified yet") =>
  items.length ? items.map((item) => `- ${item}`).join("\n") : `- ${fallback}`;

export function generateSpecification(answers: ProjectAnswers): string {
  const guidance = getGuidance(answers);
  const requirements = answers.requirements.map((item) => item.trim()).filter(Boolean);
  return `# ${answers.productName || answers.projectType || "Untitled Project"} — Engineering Specification

## Executive Summary
${guidance.summary}

## Problem Statement
${answers.problem || "To be clarified."}

## Target Audience
${answers.audience || "To be clarified."}

## Current Alternatives
${answers.currentSolution || "To be researched."}

## Goals
${answers.success || "A measurable success outcome has not been defined yet."}

## Non Goals
${asList(guidance.nonGoals)}

## Functional Requirements
${asList(requirements, "To be defined")}

## Constraints
${asList(answers.constraints)}

## Risks
${asList([...answers.risks, ...guidance.surfacedRisks])}

## Definition of Done
${answers.done || "A verifiable finish line has not been defined yet."}

## Suggested Milestones
${guidance.milestones.map((item, index) => `${index + 1}. ${item}`).join("\n")}

## Future Improvements
${asList(guidance.improvements)}

## Things Worth Clarifying
${asList(guidance.clarifications)}`;
}
