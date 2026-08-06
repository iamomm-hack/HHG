"use client";

import { useEffect, useRef, useState } from "react";
import { renderBuilderCard } from "@/lib/export/render-builder-card";
import type { BuilderCardRenderInput } from "@/types/builder-card";

export function BuilderCardPreview({ input }: { input: BuilderCardRenderInput }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasRenderedRef = useRef(false);
  const [status, setStatus] = useState<"rendering" | "ready" | "error">("rendering");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      if (!canvasRef.current) return;
      if (!hasRenderedRef.current) setStatus("rendering");
      try {
        const debug = process.env.NODE_ENV !== "production" && new URLSearchParams(window.location.search).get("debugCard") === "1";
        const buffer = document.createElement("canvas");
        await renderBuilderCard(buffer, input, { debug });
        if (!active || !canvasRef.current) return;
        const visible = canvasRef.current;
        visible.width = buffer.width;
        visible.height = buffer.height;
        const context = visible.getContext("2d", { alpha: false });
        if (!context) throw new Error("Canvas rendering is unavailable in this browser.");
        context.drawImage(buffer, 0, 0);
        hasRenderedRef.current = true;
        setError("");
        setStatus("ready");
      } catch (cause) {
        if (active) { setError(cause instanceof Error ? cause.message : "The Builder Card preview could not be rendered."); setStatus("error"); }
      }
    }, 70);
    return () => { active = false; window.clearTimeout(timer); };
  }, [input]);

  return <div className="builder-card-canvas-wrap" aria-busy={status === "rendering"}>
    <canvas ref={canvasRef} width={1536} height={1024} aria-label="Live HH Goa Builder Card preview" />
    {status === "rendering" && <span className="canvas-status">Rendering preview…</span>}
    {status === "error" && <span className="canvas-error" role="alert">{error}</span>}
  </div>;
}
