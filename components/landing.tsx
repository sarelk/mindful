import { Header, PrimaryButton } from "./chrome";

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
          <div className="hero-actions">
            <PrimaryButton onClick={onStart}>Start thinking</PrimaryButton>
            <button className="text-button" onClick={() => document.getElementById("example")?.scrollIntoView({ behavior: "smooth" })}>See example <span>↘</span></button>
          </div>
          <p className="privacy"><span>✓</span> No account. No AI. Your ideas stay on your device.</p>
        </div>
        <aside className="thought-card" aria-label="How Mindful Dev works">
          <div className="card-top"><span>A thoughtful start</span><span>01 — 10</span></div>
          <blockquote>“The quality of what you build is limited by the clarity of what you understand.”</blockquote>
          <div className="thought-flow">
            {[['01', 'Understand', 'The problem & people'], ['02', 'Define', 'Success & boundaries'], ['03', 'Specify', 'A plan worth building']].map(([number, title, detail]) => (
              <div key={number}><span>{number}</span><p><b>{title}</b><small>{detail}</small></p></div>
            ))}
          </div>
        </aside>
      </section>
      <section className="example-strip" id="example"><span>FROM VAGUE IDEA</span><p>“Build me a productivity app”</p><i>→</i><span>TO BUILDABLE SPEC</span><p>Problem, audience, requirements, constraints, risks &amp; milestones</p></section>
      <footer><span>Think first. Build second.</span><span>Mindful Dev · Your ideas, structured.</span></footer>
    </main>
  );
}
