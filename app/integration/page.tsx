import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Header } from "@/components/chrome";
import { IntegrationActions } from "@/components/integration-actions";

export const metadata: Metadata = {
  title: "AI Integration — Mindful Dev",
  description: "A drop-in Markdown checkup for existing software projects and AI coding assistants.",
  openGraph: {
    title: "MINDFUL.md — One file. A clearer next move.",
    description: "Drop MINDFUL.md into an existing project and let your coding AI find the next focused move.",
    type: "website",
    images: [{ url: "/integration-social.png", width: 1200, height: 627, alt: "MINDFUL.md finding a clear path through an existing software project" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MINDFUL.md — One file. A clearer next move.",
    description: "A drop-in project checkup for your coding AI.",
    images: ["/integration-social.png"],
  },
};

export default async function IntegrationPage() {
  const content = await readFile(path.join(process.cwd(), "public", "MINDFUL.md"), "utf8");

  return <main className="integration-page">
    <Header compact />
    <div className="integration-wrap">
      <section className="integration-intro">
        <p className="question-eyebrow">Use with your coding AI</p>
        <h1>One file.<br /><em>A clearer next move.</em></h1>
        <p>Place this file in the root of an existing project. It tells your AI to inspect what is already there, separate evidence from assumptions, and recommend one focused next step—without starting implementation.</p>
        <div className="integration-command"><span>Then tell your AI</span><code>Read MINDFUL.md and run the checkup.</code></div>
        <IntegrationActions content={content} />
      </section>

      <section className="integration-document" aria-labelledby="integration-content-title">
        <div><span>MARKDOWN INTEGRATION</span><b id="integration-content-title">MINDFUL.md</b></div>
        <pre>{content}</pre>
      </section>
    </div>
  </main>;
}
