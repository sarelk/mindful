import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Mindful Dev landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Mindful Dev — Think before you build<\/title>/i);
  assert.match(html, /Think before/);
  assert.match(html, /Start thinking/);
  assert.match(html, /No account\. No AI\./);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
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
