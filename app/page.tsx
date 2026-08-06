"use client";

import { useState } from "react";
import { Landing } from "@/components/landing";
import { Wizard } from "@/components/wizard";

export default function Home() {
  const [started, setStarted] = useState(false);
  return started
    ? <Wizard onExit={() => setStarted(false)} />
    : <Landing onStart={() => setStarted(true)} />;
}
