# Mindful Dev — Existing Project Checkup

Use this file with an AI coding assistant to decide what your existing project should do next.

## How to run this checkup

Read this entire file, then inspect the repository before responding. Do not ask me to describe anything you can learn from the code, documentation, configuration, tests, commit history, or available product artifacts.

Your job is to recommend the smallest useful next move—not to generate a generic backlog or begin coding.

## Working rules

1. Start read-only. Do not edit files, install packages, run migrations, deploy, or contact external services.
2. Ground every important claim in repository evidence. Name the files, behavior, or data that support it.
3. Separate facts from inferences. Say when evidence is missing or ambiguous.
4. Optimize for learning and user value before feature volume.
5. Prefer one narrow, reversible move over a redesign or multi-feature roadmap.
6. Respect the project's existing architecture, conventions, and unfinished work.
7. Do not treat TODO comments, old plans, or the loudest feature request as proof of priority.
8. Ask at most three questions, and only after inspection. Ask only questions whose answers could materially change the recommendation.
9. Do not implement the recommendation until I explicitly ask you to.

## Inspect the project

Look for the strongest available evidence in:

- README files, product briefs, specifications, and decision records
- application entry points, routes, screens, and primary user journeys
- package manifests, frameworks, services, and deployment configuration
- data models, authentication, billing, analytics, and integrations
- tests, CI, error handling, accessibility, security, and performance safeguards
- TODO/FIXME markers, open work, recent commits, and working-tree changes
- analytics exports, support notes, research, or feedback stored in the repository

Ignore generated files, dependencies, build output, and secrets. Do not print secret values.

## Decide what matters now

Infer, when possible:

- what the product is and who it appears to serve
- the useful action or outcome it currently enables
- its likely stage: prototype, private MVP, public beta, launched, or growing
- the most important user journey already implemented
- the strongest evidence of real usage, demand, friction, or technical risk
- the project's current constraints and available capacity
- the largest gap between the apparent promise and current behavior

Choose exactly one current objective from this list, or name a more accurate one:

- get the first real users
- turn more visitors into signups
- help new users reach value
- bring users back
- decide what to build next
- validate a feature idea
- start or improve monetization
- reduce confusion in the product
- improve reliability, security, or performance

Use this priority order when evidence is incomplete:

1. A broken, unsafe, or inaccessible core journey
2. Missing evidence that the intended user has the stated problem
3. Friction preventing users from reaching the existing value
4. Retention or repeated-use problems
5. Conversion or monetization improvements
6. New features

## Response format

Return a **Mindful Next Move** using exactly these sections:

### 1. Project snapshot

In five bullets or fewer, state the product, target user, stage, core journey, and current constraint. Include repository evidence as file references.

### 2. What is known vs. assumed

Use two short bullet lists. Do not present an inference as a verified fact.

### 3. Current bottleneck

Name one bottleneck. Explain why it outranks other plausible work and cite the evidence. If the repository cannot reveal a product bottleneck, say so and identify the smallest evidence-gathering step instead.

### 4. One next move

Recommend one action that can produce a useful result or learning within one week. Include:

- the target user and journey
- the hypothesis
- the smallest reversible change or experiment
- one primary success signal and its baseline
- a clear keep, revise, or stop decision rule
- explicit non-goals

If the evidence is mostly assumption, recommend research, observation, instrumentation, or a prototype before a production build.

### 5. Build brief

Only if coding is justified, provide:

- objective
- affected files or system areas
- acceptance criteria
- edge and failure cases
- analytics or observability needed
- test plan
- risks and rollback approach

Keep this brief implementation-ready, but do not make changes yet.

### 6. Open questions

List no more than three questions. Omit this section if none would change the next move.

End with: **If you want, tell me to implement the build brief.**

## Begin

Inspect this repository now and produce the Mindful Next Move. Do not start implementation.
