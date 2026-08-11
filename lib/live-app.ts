export const LIVE_STAGES = ["Private MVP", "Public beta", "Launched", "Growing"] as const;
export const LIVE_GOALS = [
  "Get the first real users", "Turn more visitors into signups", "Help new users reach value",
  "Bring users back", "Decide what to build next", "Validate a feature idea",
  "Start or improve monetization", "Reduce confusion in the product", "Improve reliability or performance",
] as const;
export const EVIDENCE_TYPES = ["User conversations", "Product analytics", "Session recordings or usability tests", "Support messages or reviews", "Sales conversations", "My own observation", "Mostly an assumption"] as const;
export const CONSTRAINT_OPTIONS = ["Less than a week", "2–4 weeks", "Limited engineering time", "Limited design time", "Very small budget", "Cannot disrupt current users", "Compliance or privacy requirements"] as const;
export const OTHER_OPTION = "Other / not listed";

export type LiveAnswers = {
  appName: string; appUrl: string; stage: string; audience: string; value: string; goal: string;
  evidenceTypes: string[]; evidenceDetail: string; friction: string; attempted: string;
  successMetric: string; constraints: string[]; capacity: string; otherDetails: Partial<Record<"stage" | "goal" | "evidenceTypes" | "constraints", string>>;
};

export const INITIAL_LIVE_ANSWERS: LiveAnswers = {
  appName: "", appUrl: "", stage: "", audience: "", value: "", goal: "", evidenceTypes: [],
  evidenceDetail: "", friction: "", attempted: "", successMetric: "", constraints: [], capacity: "", otherDetails: {},
};

type Playbook = { focus: string; defaultMetric: string; firstAction: string; experiment: string; codingTask: string; warning: string };
export const PLAYBOOKS: Record<string, Playbook> = {
  "Get the first real users": { focus: "distribution and problem resonance", defaultMetric: "qualified users who complete the core action", firstAction: "Speak with five people in the target audience and watch at least three try the product", experiment: "Invite one narrow audience segment with one concrete promise and manually onboard them", codingTask: "remove only the friction that blocks the first core action", warning: "More features will not resolve an unclear audience or weak distribution" },
  "Turn more visitors into signups": { focus: "message-to-signup conversion", defaultMetric: "qualified visitor-to-signup conversion", firstAction: "Compare the promise on the entry page with what successful users say they value", experiment: "Test one sharper promise and one primary call to action for the target audience", codingTask: "implement the selected message and signup-path change with conversion tracking", warning: "Raw signup volume can hide low-intent or poorly matched users" },
  "Help new users reach value": { focus: "activation", defaultMetric: "new users completing the first valuable action", firstAction: "Map the steps from signup to first value and inspect where recent users stop", experiment: "Remove, postpone, or explain the highest-friction step before first value", codingTask: "simplify the activation path and instrument every critical step", warning: "Onboarding completion is not activation unless the user receives real value" },
  "Bring users back": { focus: "retention", defaultMetric: "users repeating the core action in the relevant time window", firstAction: "Compare retained and inactive users to find the behavior that separates them", experiment: "Strengthen one recurring trigger or make the saved value visible at the right moment", codingTask: "improve one proven return loop and track repeat core actions", warning: "Notifications cannot create retention when the core experience has no recurring value" },
  "Decide what to build next": { focus: "prioritization", defaultMetric: "movement in the product's current bottleneck metric", firstAction: "List requests by user segment, frequency, severity, and evidence—not enthusiasm", experiment: "Prototype the smallest change that tests the highest-risk assumption", codingTask: "scope the smallest reversible version with explicit non-goals", warning: "The loudest request is not necessarily the most important problem" },
  "Validate a feature idea": { focus: "demand and usability validation", defaultMetric: "target users who attempt, adopt, or commit to the new behavior", firstAction: "Write the risky assumption behind the feature and identify who must behave differently", experiment: "Test the behavior with a prototype, concierge workflow, or fake door before full implementation", codingTask: "build an instrumented thin slice behind a reversible release mechanism", warning: "Positive opinions are weaker evidence than commitment or observed behavior" },
  "Start or improve monetization": { focus: "willingness to pay", defaultMetric: "qualified users who start and complete a paid conversion", firstAction: "Identify the user, moment, and outcome where value is strongest", experiment: "Present one clear offer to a defined segment and record objections and conversions", codingTask: "implement the smallest measurable pricing or checkout test", warning: "Pricing cannot compensate for an unclear or unproven value proposition" },
  "Reduce confusion in the product": { focus: "usability and comprehension", defaultMetric: "target users completing the critical flow without assistance", firstAction: "Observe five target users attempt the critical task without coaching", experiment: "Change the single point where users hesitate, misinterpret, or make an error", codingTask: "make one focused interaction change and capture completion and error events", warning: "A broad redesign can erase useful learning and introduce new uncertainty" },
  "Improve reliability or performance": { focus: "service quality", defaultMetric: "successful core actions within an acceptable response time", firstAction: "Rank failures by affected users, frequency, severity, and business impact", experiment: "Fix the highest-impact failure class and compare the same service-level measure", codingTask: "reproduce, instrument, fix, and regression-test the highest-impact issue", warning: "Aggregate uptime can conceal a broken critical journey" },
};

export const goalContext = (goal: string) => PLAYBOOKS[goal] ?? PLAYBOOKS["Decide what to build next"];

const list = (items: string[], fallback = "Not provided") => items.length ? items.map((x) => `- ${x}`).join("\n") : `- ${fallback}`;
export function resolvedChoice(a: LiveAnswers, key: "stage" | "goal") {
  return a[key] === OTHER_OPTION ? a.otherDetails[key]?.trim() || OTHER_OPTION : a[key];
}
export function resolvedChoices(a: LiveAnswers, key: "evidenceTypes" | "constraints") {
  return a[key].map((item) => item === OTHER_OPTION ? a.otherDetails[key]?.trim() || OTHER_OPTION : item);
}
export function evidenceLevel(a: LiveAnswers) {
  if (a.evidenceTypes.includes("Mostly an assumption") && a.evidenceTypes.length === 1) return "assumption";
  if (a.evidenceTypes.some((x) => ["Product analytics", "Session recordings or usability tests", "User conversations"].includes(x)) && a.evidenceDetail.trim()) return "strong";
  return "developing";
}

export function generateNextMovePack(a: LiveAnswers) {
  const stage = resolvedChoice(a, "stage"); const goal = resolvedChoice(a, "goal");
  const evidenceTypes = resolvedChoices(a, "evidenceTypes"); const constraints = resolvedChoices(a, "constraints");
  const p = goalContext(a.goal); const evidence = evidenceLevel(a);
  const nextMove = evidence === "assumption" ? `${p.firstAction}. Do this before committing to a build.` : `${p.experiment}.`;
  const metric = a.successMetric || p.defaultMetric;
  return `# ${a.appName || "Live App"} — Next Move Pack

## Decision snapshot
- **App URL:** ${a.appUrl || "Not provided"}
- **Product stage:** ${stage || "Not provided"}
- **Target user:** ${a.audience || "Not provided"}
- **Value delivered:** ${a.value || "Not provided"}
- **Current objective:** ${goal || "Not provided"}
- **Primary focus:** ${p.focus}
- **Evidence confidence:** ${evidence === "strong" ? "Strong enough for a focused test" : evidence === "developing" ? "Developing—validate while testing" : "Assumption—gather evidence before building"}

## Submitted context
- **Product name:** ${a.appName || "Not provided"}
- **Evidence sources:** ${evidenceTypes.join(", ") || "Not provided"}
- **Evidence observed:** ${a.evidenceDetail || "Not provided"}
- **Critical friction:** ${a.friction || "Not provided"}
- **Previous attempts:** ${a.attempted || "Not provided"}
- **Success metric:** ${a.successMetric || "Not provided; using the suggested metric below"}
- **Constraints:** ${constraints.join(", ") || "Not provided"}
- **Available capacity:** ${a.capacity || "Not provided"}

## What we know
${a.evidenceDetail || "No concrete evidence was recorded yet."}

## Observed bottleneck
${a.friction || "The exact point of friction still needs to be observed."}

## One next move
${nextMove}

Do not expand the scope until this produces a clear learning. ${p.warning}.

## One-week action plan
1. Write down the baseline for **${metric}**.
2. ${p.firstAction}.
3. Choose one user segment and one critical journey; exclude unrelated requests.
4. ${p.experiment}.
5. Review the result, record what changed, and decide to keep, revise, or stop.

## Experiment card
- **Hypothesis:** For ${a.audience || "the target user"}, addressing “${a.friction || "the observed bottleneck"}” will improve ${metric}.
- **Smallest test:** ${p.experiment}.
- **Success measure:** ${metric}.
- **Evidence to collect:** behavior before and after, direct observations, and reasons from users who do not complete the journey.
- **Decision rule:** Keep only if the target behavior improves without creating a more serious downstream problem.

## Build brief
- **Objective:** ${p.codingTask}.
- **Current behavior:** ${a.friction || "Document the current behavior before implementation."}
- **Previous attempts:** ${a.attempted || "None recorded."}
- **Constraints:**\n${list(constraints)}
- **Available capacity:** ${a.capacity || "Not provided"}
- **Out of scope:** unrelated flows, speculative features, and broad redesign work.
- **Required instrumentation:** track entry, completion, failure, and time-to-value for the affected journey.
- **QA:** test the happy path, empty/error states, existing-user behavior, mobile/responsive behavior, and analytics events.

## Build prompt
I am improving ${a.appName || "a live app"}${a.appUrl ? ` (${a.appUrl})` : ""}, currently at the ${stage || "shipped"} stage. It helps ${a.audience || "a target audience"} ${a.value || "reach its intended outcome"}. Our current objective is to ${goal ? goal.toLowerCase() : "improve the product"}. The observed problem is: ${a.friction || "[describe observed friction]"}. Evidence sources: ${evidenceTypes.join(", ") || "[add sources]"}. Evidence observed: ${a.evidenceDetail || "[add evidence]"}.

Help me ${p.codingTask}. First inspect the existing implementation and state your assumptions. Propose the smallest reversible change, with explicit non-goals. Define acceptance criteria, edge cases, analytics events, and a test plan. Optimize for ${metric}. Work within these constraints: ${constraints.join(", ") || "[add constraints]"}. Available capacity: ${a.capacity || "[add capacity]"}. Do not redesign or change unrelated parts of the product.`;
}
