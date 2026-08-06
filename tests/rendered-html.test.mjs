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
  assert.match(landing, /Think before/);
  assert.match(landing, /Start thinking/);
  assert.match(landing, /No account\. No AI\./);
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
