"use client";

import { themes } from "@/data/themes";
import type { BuilderDetails, PreviewMode, ThemeId } from "@/types/builder";

interface Props { image: string | null; details: BuilderDetails; title: string; number: string; theme: ThemeId; mode: PreviewMode; cropPosition: string }

export function BuilderPreview({ image, details, title, number, theme, mode, cropPosition }: Props) {
  const t=themes[theme];
  if(mode==="profile") return <div className={`profile-preview theme-${theme}`} style={{"--bg":t.bg,"--a":t.accentA,"--b":t.accentB} as React.CSSProperties}>
    <div className="profile-top">HH GOA 2026 · BUILDER LOG</div>
    <div className="profile-ring"><div className="profile-photo" style={image?{backgroundImage:`url(${image})`,backgroundPosition:cropPosition}:{}}>{!image&&<span>YOUR<br/>PHOTO</span>}</div></div>
    <div className="profile-stamp">GOA · 28–31 OCT 2026 / गोवा<small>#FRAMEINGOA</small></div>
  </div>;
  return <div className={`card-preview theme-${theme}`} style={{"--bg":t.bg,"--panel":t.panel,"--text":t.text,"--muted":t.muted,"--a":t.accentA,"--b":t.accentB,"--grid":t.grid} as React.CSSProperties}>
    <div className="card-meta"><span>GOA, INDIA · 28–31 OCT 2026</span><b>{number}</b></div>
    <div className="day-meta"><span>LAUNCH MODE</span><span>{t.note}</span></div>
    <div className="portrait" style={image?{backgroundImage:`linear-gradient(transparent 55%,rgba(0,0,0,.62)),url(${image})`,backgroundPosition:cropPosition}:{}}>{!image&&<span>DROP IN<br/>YOUR SIGNAL</span>}</div>
    <div className="identity"><h3>{(details.name||"YOUR NAME").toUpperCase()}</h3><strong>{title}</strong><p>{(details.role||"PRIMARY ROLE").toUpperCase()}</p><div>{details.stack.length?details.stack.slice(0,4).join(" · ").toUpperCase():"STACK · GOES · HERE"}</div>{details.statement&&<blockquote>“{details.statement}”</blockquote>}</div>
    <div className="matrix" aria-hidden="true">{Array.from({length:25},(_,i)=><i key={i} className={(i*7+number.charCodeAt(2))%3===0?"on":""}/>)}</div>
    <div className="horizon" aria-hidden="true" />
    <div className="card-footer"><b>#FRAMEINGOA</b><span>गोवा / HH GOA 2026</span></div>
  </div>;
}
