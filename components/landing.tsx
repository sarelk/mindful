import { Header, PrimaryButton } from "./chrome";

const DEMO_SCREENS = [
  { step: "01", eyebrow: "The shape", question: "What are you building?", choices: ["SaaS", "Mobile App", "Internal Tool"] },
  { step: "03", eyebrow: "The problem", question: "What problem are you solving?", choices: ["Who experiences it?", "Why does it matter?"] },
  { step: "05", eyebrow: "The outcome", question: "What does success look like?", choices: ["Observable", "Measurable", "Focused"] },
] as const;

export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main className="landing">
      <Header />
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker"><span />A calmer way to start software projects</p>
          <h1>Think before<br />you <em>build.</em></h1>
          <p className="subhead">A guided framework for turning vague software ideas into structured engineering specifications.</p>
          <p className="support">Most people jump straight into AI and ask it to build something. Mindful Dev helps you understand the problem first, define success, identify constraints, and produce a specification that both humans and AI can build from.</p>
          <div className="hero-actions"><PrimaryButton onClick={onStart}>Start thinking</PrimaryButton></div>
          <p className="privacy"><span>✓</span> No account. No AI. Your ideas stay on your device.</p>
        </div>
        <aside className="thought-card wizard-demo" aria-label="Preview of the Mindful Dev wizard">
          <div className="card-top"><span>A thoughtful start</span><span>Guided · 10 steps</span></div>
          <div className="demo-progress" aria-hidden="true"><i /></div>
          <div className="demo-stage">
            {DEMO_SCREENS.map((screen, index) => (
              <div className="demo-screen" style={{ "--demo-index": index } as React.CSSProperties} key={screen.step} aria-hidden={index > 0}>
                <p><span>{screen.step}</span>{screen.eyebrow}</p>
                <h2>{screen.question}</h2>
                <div className="demo-choices">{screen.choices.map((choice, choiceIndex) => <span className={choiceIndex === 0 ? "active" : ""} key={choice}>{choice}{choiceIndex === 0 && <b>✓</b>}</span>)}</div>
              </div>
            ))}
          </div>
          <div className="demo-footer"><span>Draft saved locally</span><b>Continue →</b></div>
        </aside>
      </section>
      <section className="example-strip" id="example"><span>FROM VAGUE IDEA</span><p>“Build me a productivity app”</p><i>→</i><span>TO BUILDABLE SPEC</span><p>Problem, audience, requirements, constraints, risks &amp; milestones</p></section>
      <footer><span>Think first. Build second.</span><span>Built with care by <a href="https://thing.im" target="_blank" rel="noreferrer">thing.im</a></span></footer>
    </main>
  );
}
