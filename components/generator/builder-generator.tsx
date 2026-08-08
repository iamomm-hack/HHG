"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Camera, Check, Clipboard, Download, ImagePlus, RefreshCw, Share2, Sparkles, Upload, Users } from "lucide-react";
import { Toaster, toast } from "sonner";
import { builderNumber, generateTitle } from "@/lib/builder-title/generate-title";
import { getBuilderCardLayout } from "@/lib/export/builder-card-layout";
import { exportBuilderCard, exportBuilderSharePreview } from "@/lib/export/export-builder-card";
import { prepareImage } from "@/lib/image/process";
import { SHARE_CAPTION, xIntent } from "@/lib/share/x";
import { builderDetailsSchema } from "@/lib/validation/builder-details";
import type { BuilderDetails } from "@/types/builder";
import type { BuilderCardRenderInput, TeamSize } from "@/types/builder-card";
import { BuilderCardPreview } from "@/components/generator/builder-card-preview";

const roleSuggestions = ["Developer", "Designer", "Founder", "Builder", "Researcher", "Engineer", "Student", "Product Engineer", "Smart Contract Developer", "Protocol Engineer", "Community Builder", "Open-Source Contributor"];
const stackSuggestions = ["Rust", "React", "Next.js", "TypeScript", "Solidity", "Move", "AI", "Backend", "Full Stack", "Mobile", "Design", "DevRel", "Open Source", "Infrastructure"];
const emptyDetails: BuilderDetails = { teamName: "", name: "", role: "", stack: [], x: "", statement: "" };
const emptyPhotos: Array<string | null> = [null, null, null];
const photoTransform = { zoom: 1, offsetX: 0, offsetY: 0 } as const;

export function BuilderGenerator() {
  const reduce = useReducedMotion();
  const [teamSize, setTeamSize] = useState<TeamSize>(1);
  const [photos, setPhotos] = useState<Array<string | null>>(emptyPhotos);
  const photoRefs = useRef<Array<string | null>>([...emptyPhotos]);
  const uploadTargetRef = useRef(0);
  const cameraTargetRef = useRef(0);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const sharingRef = useRef(false);
  const sharePreparingRef = useRef<Promise<string> | null>(null);
  const [processingIndex, setProcessingIndex] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<BuilderDetails>(emptyDetails);
  const [memberNames, setMemberNames] = useState<string[]>(["", "", ""]);
  const [memberRoles, setMemberRoles] = useState<string[]>(["", "", ""]);
  const [memberXUsernames, setMemberXUsernames] = useState<string[]>(["", "", ""]);
  const [reroll, setReroll] = useState(0);
  const [exporting, setExporting] = useState<string | null>(null);
  const [preparedShareUrl, setPreparedShareUrl] = useState("");
  const [sessionSeed, setSessionSeed] = useState("hhgoa-session");

  const title = useMemo(() => generateTitle(details, reroll), [details, reroll]);
  const number = useMemo(() => builderNumber(details.name, sessionSeed), [details.name, sessionSeed]);
  const layout = getBuilderCardLayout(teamSize);
  const requiredPhotos = photos.slice(0, teamSize);
  const photosReady = requiredPhotos.every(Boolean);
  const memberNamesReady = teamSize === 1 || memberNames.slice(0, teamSize).every((name) => name.trim().length > 0);
  const identityNamesReady = memberNamesReady && (teamSize > 1 || details.teamName.trim().length > 0);
  const cardInput = useMemo<BuilderCardRenderInput>(() => ({
    details: { teamName: teamSize === 1 ? details.teamName : details.name, name: details.name, role: details.role, stack: details.stack, xUsername: teamSize === 1 ? details.x : "", statement: details.statement, builderTitle: title, builderNumber: number },
    teamSize,
    memberNames: teamSize === 1 ? [details.name] : memberNames.slice(0, teamSize),
    memberRoles: teamSize > 1 ? memberRoles.slice(0, teamSize) : [],
    memberXUsernames: teamSize > 1 ? memberXUsernames.slice(0, teamSize) : [],
    photoUrls: photos.slice(0, teamSize),
    photoTransforms: Array.from({ length: teamSize }, () => ({ ...photoTransform })),
    photoCrops: Array.from({ length: teamSize }, () => null),
  }), [details.teamName, details.name, details.role, details.stack, details.x, details.statement, title, number, teamSize, memberNames, memberRoles, memberXUsernames, photos]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("hhgoa-details");
      if (raw) {
        const stored = { ...emptyDetails, ...JSON.parse(raw) } as BuilderDetails;
        setDetails({ ...stored, stack: stored.stack.filter((value) => value !== "Soroban" && value !== "Stellar") });
      }
      sessionStorage.removeItem("hhgoa-theme");
      let storedSeed = sessionStorage.getItem("hhgoa-seed");
      if (!storedSeed) { storedSeed = crypto.randomUUID(); sessionStorage.setItem("hhgoa-seed", storedSeed); }
      setSessionSeed(storedSeed);
    } catch {}
  }, []);
  useEffect(() => { try { sessionStorage.setItem("hhgoa-details", JSON.stringify(details)); } catch {} }, [details]);
  useEffect(() => {
    if (step === 1) return;
    const frame = window.requestAnimationFrame(() => workspaceRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
    return () => window.cancelAnimationFrame(frame);
  }, [step, reduce]);

  const acceptFile = useCallback(async (file: File, index: number) => {
    setProcessingIndex(index);
    try {
      const blob = await prepareImage(file);
      const url = URL.createObjectURL(blob);
      if (photoRefs.current[index]) URL.revokeObjectURL(photoRefs.current[index]!);
      photoRefs.current[index] = url;
      setPhotos((current) => current.map((photo, photoIndex) => photoIndex === index ? url : photo));
      toast.success(`Member ${index + 1} photo framed automatically.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not process that photo.");
    } finally { setProcessingIndex(null); }
  }, []);

  useEffect(() => {
    const paste = (event: ClipboardEvent) => {
      const file = [...(event.clipboardData?.files ?? [])].find((item) => item.type.startsWith("image/"));
      if (!file) return;
      const target = photos.slice(0, teamSize).findIndex((photo) => !photo);
      void acceptFile(file, target === -1 ? 0 : target);
    };
    window.addEventListener("paste", paste);
    return () => window.removeEventListener("paste", paste);
  }, [acceptFile, photos, teamSize]);
  useEffect(() => () => { photoRefs.current.forEach((url) => { if (url) URL.revokeObjectURL(url); }); }, []);

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) void acceptFile(files[0], uploadTargetRef.current);
  }, [acceptFile]);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop, noClick: true, noKeyboard: true, multiple: false,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"], "image/heic": [".heic"], "image/heif": [".heif"] },
  });

  const choosePhoto = (index: number) => { uploadTargetRef.current = index; open(); };
  const openCamera = (index: number) => { cameraTargetRef.current = index; cameraInputRef.current?.click(); };
  const changeTeamSize = (size: TeamSize) => {
    setTeamSize(size);
    setStep(1);
    if (size < 3) {
      for (let index = size; index < 3; index += 1) {
        if (photoRefs.current[index]) URL.revokeObjectURL(photoRefs.current[index]!);
        photoRefs.current[index] = null;
      }
      setPhotos((current) => current.map((photo, index) => index < size ? photo : null));
    }
  };

  const valid = builderDetailsSchema.safeParse(details);
  const canExport = Boolean(photosReady && identityNamesReady && valid.success && processingIndex === null);
  const slug = (details.name || "builder").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42) || "builder";
  const cardKind = teamSize === 1 ? "builder" : "team";

  function assertReady() {
    if (!photosReady) throw new Error(`Add all ${teamSize} team photo${teamSize > 1 ? "s" : ""} first.`);
    if (!identityNamesReady) throw new Error(teamSize === 1 ? "Add your team name." : "Add a name for every team member.");
    if (!valid.success) throw new Error(valid.error.issues[0]?.message || "Complete the required details.");
  }
  async function createCardBlob() { assertReady(); return (await exportBuilderCard(cardInput)).blob; }
  const prepareShareLink = useCallback(async () => {
    if (preparedShareUrl) return preparedShareUrl;
    if (sharePreparingRef.current) return sharePreparingRef.current;
    const task = (async () => {
      const capability = await fetch("/api/share", { method: "GET", cache: "no-store" });
      const state = capability.ok ? await capability.json() as { configured?: boolean } : { configured: false };
      if (!state.configured) throw new Error("Image sharing is not configured on this server. Add BLOB_READ_WRITE_TOKEN to .env.local or use the deployed app.");
      const shareId = crypto.randomUUID().replaceAll("-", "").slice(0, 16);
      const publicOrigin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const publicUrl = new URL(`/share/${shareId}`, publicOrigin).toString();
      const upload = async (mimeType: "image/jpeg" | "image/png") => {
        const blob = await exportBuilderSharePreview(cardInput, mimeType);
        const extension = mimeType === "image/jpeg" ? "jpg" : "png";
        const file = new File([blob], `hh-goa-2026-${slug}-${cardKind}-preview.${extension}`, { type: mimeType });
        const body = new FormData();
        body.append("id", shareId);
        body.append("image", file);
        return fetch("/api/share", { method: "POST", body });
      };
      let response = await upload("image/jpeg");
      if (!response.ok) response = await upload("image/png");
      if (!response.ok) {
        const payload = await response.json().catch(() => ({})) as { error?: string; detail?: string };
        throw new Error(payload.detail || payload.error || "The X image preview could not be uploaded.");
      }
      setPreparedShareUrl(publicUrl);
      return publicUrl;
    })();
    sharePreparingRef.current = task;
    try { return await task; }
    finally { sharePreparingRef.current = null; }
  }, [preparedShareUrl, cardInput, slug, cardKind]);

  useEffect(() => {
    setPreparedShareUrl("");
    sharePreparingRef.current = null;
  }, [cardInput]);

  useEffect(() => {
    if (step === 3 && canExport && !preparedShareUrl) void prepareShareLink().catch(() => undefined);
  }, [step, canExport, preparedShareUrl, prepareShareLink]);

  async function runExport() {
    if (!canExport) { toast.error(photosReady ? "Complete your name, role, and stack first." : `Upload ${teamSize} member photo${teamSize > 1 ? "s" : ""} first.`); return; }
    setExporting("card");
    try {
      const mod = await import("@/lib/export/render");
      mod.downloadBlob(await createCardBlob(), `hh-goa-2026-${slug}-${cardKind}-card.png`);
      toast.success("High-resolution PNG downloaded.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Export failed. Please try again."); }
    finally { setExporting(null); }
  }
  async function share() {
    if (sharingRef.current) return;
    if (!canExport) { toast.error("Finish your team identity before sharing."); return; }
    sharingRef.current = true;
    setExporting("share");
    try {
      const publicUrl = await prepareShareLink();
      const intent = xIntent(publicUrl);
      const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobileDevice) window.location.assign(intent);
      else {
        const xWindow = window.open(intent, "_blank", "noopener,noreferrer");
        if (!xWindow) window.location.assign(intent);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The generated X image preview could not be prepared.", { duration: 10000 });
    } finally { sharingRef.current = false; setExporting(null); }
  }

  const setField = <K extends keyof BuilderDetails>(key: K, value: BuilderDetails[K]) => setDetails((current) => ({ ...current, [key]: value }));
  const setMemberName = (index: number, value: string) => setMemberNames((current) => current.map((name, memberIndex) => memberIndex === index ? value.replace(/[<>]/g, "") : name));
  const setMemberRole = (index: number, value: string) => setMemberRoles((current) => current.map((role, memberIndex) => memberIndex === index ? value.replace(/[<>]/g, "") : role));
  const setMemberXUsername = (index: number, value: string) => setMemberXUsernames((current) => current.map((username, memberIndex) => memberIndex === index ? value.replace(/^@/, "").replace(/[^a-zA-Z0-9_]/g, "") : username));
  const toggleStack = (value: string) => setDetails((current) => ({ ...current, stack: current.stack.includes(value) ? current.stack.filter((stack) => stack !== value) : current.stack.length < 5 ? [...current.stack, value] : current.stack }));
  const generateIdentity = () => {
    if (!valid.success) { toast.error(valid.error?.issues[0]?.message || "Complete the required details."); return; }
    let nextSeed = crypto.randomUUID();
    while (builderNumber(details.name, nextSeed) === number) nextSeed = crypto.randomUUID();
    setSessionSeed(nextSeed);
    try { sessionStorage.setItem("hhgoa-seed", nextSeed); } catch {}
    setStep(3);
  };

  return <main>
    <Toaster theme="dark" position="top-center" richColors />
    <section className="generator-section" id="generator">
      <div className="section-heading">
        <div className="section-heading-copy"><span>HH GOA 2026 / BUILDER ID</span><h2>Frame your Goa identity.</h2><p>Create a solo ID for yourself or bring teammates together in one unmistakable HH Goa frame.</p></div>
        <div className="event-brand-lockup" aria-label="Hacker House Goa by 2:47">
          <img className="event-wordmark" src="/brand/hhgoa-hacker-house.png" alt="Hacker House" />
          <div><img src="/brand/hhgoa-goa.svg" alt="Goa" /><img src="/brand/hhgoa-247.svg" alt="2:47" /></div>
        </div>
      </div>
      <div className={`workspace ${step === 3 ? "export-step" : ""}`} ref={workspaceRef}>
        <div className="controls-panel">
          <nav className="steps three-steps" aria-label="Generator steps">{([[1, "PHOTO"], [2, "DETAILS"], [3, "EXPORT"]] as const).map(([number, label]) => <button key={number} onClick={() => number <= step && setStep(number)} className={step === number ? "active" : step > number ? "done" : ""}><span>{step > number ? <Check size={14} /> : `0${number}`}</span>{label}</button>)}</nav>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step} className="step-content" initial={reduce ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? {} : { opacity: 0, x: -10 }} transition={{ duration: .18 }}>
              {step === 1 && <>
                <div className="step-kicker">01 / PICK A FORMAT</div><h3>Choose your frame style.</h3><p className="step-copy">Make an individual spotlight or a shared team frame—the choice is only about this graphic, not the size of your actual team.</p>
                <div className="team-size-picker" aria-label="Frame format"><span>FRAME FORMAT</span><div>{([1, 2, 3] as TeamSize[]).map((size) => <button type="button" key={size} className={teamSize === size ? "selected" : ""} onClick={() => changeTeamSize(size)}><Users size={16} /> {(["SOLO", "DUO", "TRIO"] as const)[size - 1]}</button>)}</div></div>
                <div {...getRootProps()} className={`drop-zone team-drop-zone ${isDragActive ? "dragging" : ""}`}>
                  <input {...getInputProps()} />
                  <div className="team-photo-slots">{Array.from({ length: teamSize }, (_, index) => <article className={`team-photo-slot ${photos[index] ? "filled" : ""}`} key={index}>
                    <div className="member-photo-thumb" style={photos[index] ? { backgroundImage: `url(${photos[index]})` } : undefined}>{!photos[index] && <ImagePlus size={25} />}</div>
                    <strong>{teamSize === 1 ? "YOUR PHOTO" : `MEMBER ${index + 1}`}</strong>
                    <div className="member-photo-actions"><button type="button" onClick={() => choosePhoto(index)} disabled={processingIndex !== null}><Upload size={14} /> {processingIndex === index ? "PROCESSING…" : photos[index] ? "REPLACE" : "CHOOSE"}</button><button type="button" aria-label={`Open camera for member ${index + 1}`} onClick={() => openCamera(index)} disabled={processingIndex !== null}><Camera size={15} /></button></div>
                  </article>)}</div>
                  <small>JPG, PNG, WEBP, HEIC · max 20 MB each</small>
                </div>
                <input ref={cameraInputRef} type="file" accept="image/*" capture="user" hidden onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) void acceptFile(file, cameraTargetRef.current); event.currentTarget.value = ""; }} />
                <button className="primary-button full" type="button" disabled={!photosReady || processingIndex !== null} onClick={() => setStep(2)}>CONTINUE WITH {teamSize === 1 ? "SOLO" : `${teamSize}-PERSON`} FRAME</button>
              </>}
              {step === 2 && <>
                <div className="step-kicker">02 / MAKE IT YOURS</div><h3>{teamSize === 1 ? "Tell us who is building." : "Name the team behind the build."}</h3><div className="auto-frame-note"><Check size={16} /> {teamSize} photo{teamSize > 1 ? "s" : ""} framed automatically. <button onClick={() => setStep(1)}>Replace photos</button></div>
                {teamSize === 1 && <label className="field"><span>TEAM NAME <b>{details.teamName.length}/38</b></span><input value={details.teamName} maxLength={38} placeholder="Your team name" onChange={(event) => setField("teamName", event.target.value.replace(/[<>]/g, ""))} /></label>}
                <label className="field"><span>{teamSize === 1 ? "NAME" : "TEAM NAME"} <b>{details.name.length}/38</b></span><input value={details.name} maxLength={38} placeholder={teamSize === 1 ? "Your name" : "Your team name"} onChange={(event) => setField("name", event.target.value.replace(/[<>]/g, ""))} /></label>
                {teamSize > 1 && <div className="member-name-section"><span>TEAM MEMBER DETAILS</span><div className="member-name-grid">{Array.from({ length: teamSize }, (_, index) => <div className="member-identity-fields" key={index}><label className="field"><span>MEMBER {index + 1} NAME <b>{memberNames[index].length}/26</b></span><input value={memberNames[index]} maxLength={26} placeholder={`Member ${index + 1} name`} onChange={(event) => setMemberName(index, event.target.value)} /></label><label className="field"><span>MEMBER {index + 1} ROLE <b>{memberRoles[index].length}/32</b></span><input value={memberRoles[index]} maxLength={32} placeholder="Role" onChange={(event) => setMemberRole(index, event.target.value)} /></label><label className="field"><span>MEMBER {index + 1} X TAG <small>OPTIONAL</small></span><input value={memberXUsernames[index]} maxLength={39} placeholder="X username" autoComplete="off" onChange={(event) => setMemberXUsername(index, event.target.value)} /></label></div>)}</div></div>}
                <div className="field"><span>PRIMARY ROLE</span><div className="chips">{roleSuggestions.map((role) => <button key={role} className={details.role === role ? "selected" : ""} onClick={() => setField("role", role)}>{role}</button>)}</div><input value={details.role} maxLength={40} placeholder="Or type a custom role" onChange={(event) => setField("role", event.target.value.replace(/[<>]/g, ""))} /></div>
                <div className="field"><span>PRIMARY STACK <b>{details.stack.length}/5</b></span><div className="chips">{stackSuggestions.map((stack) => <button key={stack} className={details.stack.includes(stack) ? "selected" : ""} onClick={() => toggleStack(stack)}>{stack}</button>)}</div><input placeholder="Add custom technology + Enter" maxLength={24} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); const value = event.currentTarget.value.trim().replace(/[<>]/g, ""); if (value && !details.stack.includes(value) && details.stack.length < 5) { toggleStack(value); event.currentTarget.value = ""; } } }} /></div>
                {teamSize === 1 && <label className="field"><span>X USERNAME <small>OPTIONAL</small></span><input value={details.x} maxLength={39} placeholder="username" aria-label="X username" autoComplete="off" onChange={(event) => setField("x", event.target.value.replace(/^@/, "").replace(/[^a-zA-Z0-9_]/g, ""))} /></label>}
                <label className="field"><span>BUILDER STATEMENT (Optional) <b>{details.statement.length}/90</b></span><textarea value={details.statement} maxLength={90} placeholder="What are you here to ship?" onChange={(event) => setField("statement", event.target.value.replace(/[<>]/g, ""))} /></label>
                <div className="generated-title"><span>GENERATED BUILDER TITLE</span><strong>{title}</strong><button aria-label="Reroll builder title" onClick={() => setReroll((value) => value + 1)}><RefreshCw size={16} /></button></div>
                {!valid.success && details.name && <p className="validation" role="alert">{valid.error.issues[0]?.message}</p>}
                <button className="primary-button full" disabled={!identityNamesReady} onClick={generateIdentity}>GENERATE {teamSize > 1 ? "TEAM" : "MY"} IDENTITY <Sparkles size={17} /></button>
              </>}
              {step === 3 && <>
                <div className="step-kicker">03 / READY TO SHIP</div><h3>Your HH Goa identity is ready.</h3><p className="step-copy">Download the full-resolution card or share it with the Goa builder community.</p>
                <div className="export-list"><button onClick={() => void runExport()} disabled={Boolean(exporting)}><span><b>{exporting === "card" ? "Rendering your card…" : "Builder ID Card"}</b><small>{layout.templateWidth} × {layout.templateHeight} PNG · {teamSize} member{teamSize > 1 ? "s" : ""}</small></span><Download /></button></div>
                <div className="share-box"><h4>Ready to frame in Goa?</h4><div className="radar-note">✦ Caption includes @247pmstudio and #FrameInGoa to get featured in the Radar.</div><div className="share-actions"><button className="x-button" onClick={() => void share()} disabled={Boolean(exporting)}><Share2 size={18} /> {exporting === "share" ? "PREPARING IMAGE…" : "SHARE TO X"}</button><button className="copy-button" onClick={async () => { try { await navigator.clipboard.writeText(SHARE_CAPTION); toast.success("Caption copied."); } catch { toast.error("Could not copy. Select and copy the caption manually."); } }}><Clipboard size={16} /> COPY CAPTION</button></div></div>
              </>}
            </motion.div>
          </AnimatePresence>
        </div>
        <aside className="preview-panel"><div className="preview-toolbar"><div className="segmented"><button className="active" type="button">{teamSize > 1 ? `TEAM × ${teamSize}` : "ID CARD"}</button></div><span>{layout.templateWidth} × {layout.templateHeight}</span></div><motion.div className="preview-stage card-stage" layout><motion.div initial={reduce ? false : { opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }}><BuilderCardPreview input={cardInput} /></motion.div></motion.div></aside>
      </div>
    </section>
    <footer className="site-footer"><div className="footer-brand-assets"><img src="/brand/hhgoa-hacker-house.png" alt="Hacker House" /><div><img src="/brand/hhgoa-goa.svg" alt="Goa" /><img src="/brand/hhgoa-247.svg" alt="2:47" /></div></div><p>Less Noise. More Signal.</p><div>GOA, INDIA · 28–31 OCT 2026<br /><span>2:47 pm Studio · गोवा</span></div></footer>
  </main>;
}
