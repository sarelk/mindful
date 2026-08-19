"use client";

import { useState } from "react";

export function IntegrationActions({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return <div className="integration-actions">
    <button type="button" onClick={copy}>{copied ? "Copied ✓" : "Copy Markdown"}</button>
    <a href="/MINDFUL.md" download="MINDFUL.md">Download MINDFUL.md <span aria-hidden="true">↓</span></a>
  </div>;
}
