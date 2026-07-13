import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished Palworld homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Palworld Guide — Explore More\. Survive Smarter\.<\/title>/i);
  assert.match(html, /PALWORLD/);
  assert.match(html, /Latest Guides/);
  assert.match(html, /What is Palworld Guide\?/);
  assert.match(html, /href="\/guides\/first-7-days"/);
  assert.doesNotMatch(html, /Polworld|codex-preview|react-loading-skeleton/i);
});

test("server-renders a complete guide article", async () => {
  const response = await render("/guides/first-7-days");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Your First 7 Days in Palworld/);
  assert.match(html, /The short version/);
  assert.match(html, /Day 1 — Learn the survival loop/);
  assert.match(html, /Day 7 — Test the first tower/);
  assert.match(html, /Official Palworld 1\.0 changelog/);
  assert.match(html, /Related guides/);
});
