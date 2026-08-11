"use client";

import { useState } from "react";
import { Landing } from "../components/landing";
import { Wizard } from "@/components/wizard";
import { LiveWizard } from "@/components/live-wizard";

export default function Home() {
  const [mode, setMode] = useState<"before-code" | "live-app" | null>(null);
  if (mode === "before-code") return <Wizard onExit={() => setMode(null)} />;
  if (mode === "live-app") return <LiveWizard onExit={() => setMode(null)} />;
  return <Landing onStart={setMode} />;
}
