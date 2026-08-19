import { Header } from "./chrome";
import Link from "next/link";

type Mode = "before-code" | "live-app";

export function Landing({ onStart }: { onStart: (mode: Mode) => void }) {
  return <main className="landing simple-landing">
    <Header />
    <section className="simple-hero">
      <div className="simple-heading">
        <p className="kicker"><span />Mindful Dev</p>
        <h1>Where are you<br /><em>right now?</em></h1>
        <p>Choose your stage. We’ll ask the right questions and turn your thinking into a practical next step.</p>
      </div>

      <div className="simple-actions" aria-label="Choose your product stage">
        <button className="simple-flow before-flow" type="button" onClick={() => onStart("before-code")}>
          <span className="simple-index">01</span>
          <span className="simple-label">Before Code</span>
          <span className="simple-description">I have an idea and want to shape the right first version.</span>
          <span className="simple-arrow" aria-hidden="true">→</span>
        </button>
        <button className="simple-flow live-flow" type="button" onClick={() => onStart("live-app")}>
          <span className="simple-index">02</span>
          <span className="simple-label">Live App</span>
          <span className="simple-description">I have shipped something and want to choose what comes next.</span>
          <span className="simple-arrow" aria-hidden="true">→</span>
        </button>
      </div>

      <div className="ai-integration">
        <div>
          <span>Already working with an AI?</span>
          <p>Drop one file into your project. Your coding assistant will inspect what exists and recommend the next move—no wizard required.</p>
        </div>
        <Link href="/integration">View the integration <span aria-hidden="true">→</span></Link>
      </div>

      <p className="simple-privacy">No account · No AI · Drafts stay on your device</p>
    </section>
    <footer><span>Think first. Build second. Learn continuously.</span><span>Built with care by <a href="https://thing.im" target="_blank" rel="noreferrer">thing.im</a></span></footer>
  </main>;
}
