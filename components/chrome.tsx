"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function BrandMark() {
  return <span className="mark" aria-hidden="true"><i /><i /><i /></span>;
}

export function Header({ compact = false }: { compact?: boolean }) {
  const [dark, setDark] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  return (
    <header className={`site-header${compact ? " compact" : ""}`}>
      <Link className="brand" href="/" aria-label="Mindful Dev home">
        <BrandMark /><span>mindful<span className="brand-dot">.</span>dev</span>
      </Link>
      <button className="theme-toggle" onClick={() => setDark((value) => !value)} aria-label="Toggle dark mode">
        {dark ? "Light" : "Dark"}<span>◐</span>
      </button>
    </header>
  );
}

export function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className="primary" {...props}>{children}<span aria-hidden="true">→</span></button>;
}
