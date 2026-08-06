"use client";

import { useEffect, useRef, useState } from "react";
import { renderBuilderCard } from "@/lib/export/render-builder-card";
import type { BuilderCardRenderInput } from "@/types/builder-card";

export function BuilderCardPreview({ input }: { input: BuilderCardRenderInput }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"rendering" | "ready" | "error">("rendering");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      if (!canvasRef.current) return;
      setStatus("rendering");
      try {
        const debug = process.env.NODE_ENV !== "production" && new URLSearchParams(window.location.search).get("debugCard") === "1";
        await renderBuilderCard(canvasRef.current, input, { debug });
        if (active) { setError(""); setStatus("ready"); }
      } catch (cause) {
        if (active) { setError(cause instanceof Error ? cause.message : "The Builder Card preview could not be rendered."); setStatus("error"); }
      }
    }, 70);
    return () => { active = false; window.clearTimeout(timer); };
  }, [input]);

  return <div className="builder-card-canvas-wrap" aria-busy={status === "rendering"}>
    <canvas ref={canvasRef} width={1080} height={1350} aria-label="Live HH Goa Builder Card preview" />
    {status === "rendering" && <span className="canvas-status">Rendering preview…</span>}
    {status === "error" && <span className="canvas-error" role="alert">{error}</span>}
  </div>;
}
