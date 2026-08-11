import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("creates a native Next.js production artifact", async () => {
  await access(new URL("../.next/BUILD_ID", import.meta.url));
  const manifest = JSON.parse(await readFile(new URL("../.next/routes-manifest.json", import.meta.url), "utf8"));
  assert.equal(manifest.version, 3);
  assert.equal(manifest.basePath, "");
});

test("contains Mindful Dev metadata and landing content", async () => {
  const [layout, landing] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/landing.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(layout, /title: "Mindful Dev"/);
  assert.match(landing, /Where are you/);
  assert.match(landing, /Before Code/);
  assert.match(landing, /Live App/);
  assert.match(landing, /Choose your product stage/);
  assert.match(landing, /No account/);
  assert.match(landing, /No AI/);
});

test("keeps the page entrypoint thin and domain rules isolated", async () => {
  const [page, questions, specification, store] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/questions.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/specification.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/store.ts", import.meta.url), "utf8"),
  ]);
  assert.match(page, /<Wizard/);
  assert.match(page, /<Landing/);
  assert.ok(page.split("\n").length < 20);
  assert.match(questions, /QUESTIONS/);
  assert.match(specification, /PROJECT_GUIDANCE/);
  assert.match(specification, /CONTEXT_RULES/);
  assert.match(store, /persist/);
});

test("includes a separate evidence-led live app workflow", async () => {
  const [page, wizard, playbooks] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/live-wizard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/live-app.ts", import.meta.url), "utf8"),
  ]);
  assert.match(page, /live-app/);
  assert.match(wizard, /liveSteps/);
  assert.match(wizard, /What have you already tried/);
  assert.match(wizard, /What have you shipped/);
  assert.match(wizard, /What have you noticed/);
  assert.match(wizard, /What can you take on next/);
  assert.match(playbooks, /Other \/ not listed/);
  assert.match(wizard, /<button className="skip" onClick=\{next\}>Skip/);
  assert.match(playbooks, /Evidence confidence/);
  assert.match(playbooks, /One-week action plan/);
  assert.match(playbooks, /Build prompt/);
  assert.match(playbooks, /Submitted context/);
  assert.match(playbooks, /resolvedChoices/);
});

test("offers markdown downloads for both result types", async () => {
  const [beforeResults, liveResults, download] = await Promise.all([
    readFile(new URL("../components/results.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/live-results.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/download.ts", import.meta.url), "utf8"),
  ]);
  assert.match(beforeResults, /Download \.md/);
  assert.match(liveResults, /Download \.md/);
  assert.match(download, /text\/markdown/);
});
