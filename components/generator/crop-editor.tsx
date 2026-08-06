"use client";

import Cropper, { type Area } from "react-easy-crop";
import { RotateCcw } from "lucide-react";
import type { CropConfig, PreviewMode } from "@/types/builder";

interface Props { image: string; mode: PreviewMode; value: CropConfig; onChange: (value: CropConfig) => void }

export default function CropEditor({ image, mode, value, onChange }: Props) {
  const complete = (_: Area, pixels: Area) => onChange({ ...value, pixels });
  return <div className="crop-wrap">
    <div className={`crop-stage ${mode === "profile" ? "is-profile" : ""}`}>
      <Cropper image={image} crop={value.crop} zoom={value.zoom} aspect={mode === "profile" ? 1 : 16/10}
        cropShape={mode === "profile" ? "round" : "rect"} showGrid objectFit="horizontal-cover"
        onCropChange={(crop) => onChange({ ...value, crop })} onZoomChange={(zoom) => onChange({ ...value, zoom })} onCropComplete={complete} />
    </div>
    <div className="zoom-row">
      <label htmlFor={`zoom-${mode}`}>Zoom</label>
      <input id={`zoom-${mode}`} type="range" min={1} max={3} step={0.01} value={value.zoom} onChange={(e)=>onChange({...value,zoom:Number(e.target.value)})}/>
      <button className="icon-button" type="button" aria-label="Reset crop" onClick={()=>onChange({crop:{x:0,y:0},zoom:1,pixels:null})}><RotateCcw size={17}/></button>
    </div>
  </div>;
}
