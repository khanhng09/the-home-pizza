"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import { cn } from "@/shared/lib/utils";
import type { IconProps } from "@/shared/components/icons/icon.type";
import {
  IlustDongHoBanhDa,
  IlustDongHoBo,
  IlustDongHoCaTrich,
  IlustDongHoChaGioPhanThiet,
  IlustDongHoCua,
  IlustDongHoDoi,
  IlustDongHoGhe,
  IlustDongHoHen,
  IlustDongHoHoiQue,
  IlustDongHoHungQue,
  IlustDongHoLapXuong,
  IlustDongHoMacKhen,
  IlustDongHoNgheu,
  IlustDongHoNhum,
  IlustDongHoNomThinhTaiHeo,
  IlustDongHoOt,
  IlustDongHoPizzaBase,
  IlustDongHoPizzaDough,
  IlustDongHoPizzaPowder,
  IlustDongHoRauRam,
  IlustDongHoSauRieng,
  IlustDongHoTieu,
  IlustDongHoTom,
  IlustDongHoTre,
  IlustDongHoVit,
} from "@/shared/components/illustrations";

type IllustrationComponent = ComponentType<IconProps>;

interface IllustrationEntry {
  name: string;
  Comp: IllustrationComponent;
}

interface Category {
  title: string;
  items: IllustrationEntry[];
}

// Each illustration uses stroke="currentColor", so its color follows the
// inherited text color. A background preset pairs a surface with a contrasting
// foreground so the icons always read clearly.
interface BgPreset {
  label: string;
  surface: string;
  foreground: string;
  swatch: string;
}

const CATEGORIES: Category[] = [
  {
    title: "Dong Ho Figma",
    items: [
      { name: "IlustDongHoTieu", Comp: IlustDongHoTieu },
      { name: "IlustDongHoGhe", Comp: IlustDongHoGhe },
      { name: "IlustDongHoTom", Comp: IlustDongHoTom },
      { name: "IlustDongHoHen", Comp: IlustDongHoHen },
      { name: "IlustDongHoSauRieng", Comp: IlustDongHoSauRieng },
      { name: "IlustDongHoVit", Comp: IlustDongHoVit },
      { name: "IlustDongHoRauRam", Comp: IlustDongHoRauRam },
      { name: "IlustDongHoPizzaPowder", Comp: IlustDongHoPizzaPowder },
      { name: "IlustDongHoPizzaDough", Comp: IlustDongHoPizzaDough },
      { name: "IlustDongHoPizzaBase", Comp: IlustDongHoPizzaBase },
      { name: "IlustDongHoOt", Comp: IlustDongHoOt },
      { name: "IlustDongHoNomThinhTaiHeo", Comp: IlustDongHoNomThinhTaiHeo },
      { name: "IlustDongHoNhum", Comp: IlustDongHoNhum },
      { name: "IlustDongHoNgheu", Comp: IlustDongHoNgheu },
      { name: "IlustDongHoMacKhen", Comp: IlustDongHoMacKhen },
      { name: "IlustDongHoHungQue", Comp: IlustDongHoHungQue },
      { name: "IlustDongHoHoiQue", Comp: IlustDongHoHoiQue },
      { name: "IlustDongHoDoi", Comp: IlustDongHoDoi },
      { name: "IlustDongHoCua", Comp: IlustDongHoCua },
      { name: "IlustDongHoChaGioPhanThiet", Comp: IlustDongHoChaGioPhanThiet },
      { name: "IlustDongHoCaTrich", Comp: IlustDongHoCaTrich },
      { name: "IlustDongHoBo", Comp: IlustDongHoBo },
      { name: "IlustDongHoBanhDa", Comp: IlustDongHoBanhDa },
      { name: "IlustDongHoTre", Comp: IlustDongHoTre },
      { name: "IlustDongHoLapXuong", Comp: IlustDongHoLapXuong },
    ],
  },
];

const BG_PRESETS: BgPreset[] = [
  { label: "Cream", surface: "bg-cream", foreground: "text-ink", swatch: "bg-cream" },
  { label: "Linen", surface: "bg-linen", foreground: "text-ink", swatch: "bg-linen" },
  { label: "White", surface: "bg-white", foreground: "text-ink", swatch: "bg-white" },
  { label: "Clay", surface: "bg-clay", foreground: "text-cream", swatch: "bg-clay" },
  { label: "Umber", surface: "bg-umber", foreground: "text-cream", swatch: "bg-umber" },
  { label: "Ink", surface: "bg-ink", foreground: "text-cream", swatch: "bg-ink" },
];

const TOTAL = CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);

export function IllustrationsGallery() {
  const [bgIndex, setBgIndex] = useState(0);
  const bg = BG_PRESETS[bgIndex];

  return (
    <div className="container-base section">
      <header className="mb-10">
        <p className="caption text-accent-deep mb-2">Dev preview</p>
        <h1 className="h2 mb-3">Illustrations Gallery</h1>
        <p className="body-md text-ink/70">
          {TOTAL} illustration components from{" "}
          <code className="text-sm">src/shared/components/illustrations</code>.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="label text-ink/60">Background:</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Background color">
            {BG_PRESETS.map((preset, i) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setBgIndex(i)}
                aria-pressed={i === bgIndex}
                title={preset.label}
                className={cn(
                  "flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-sm transition-smooth focus-ring",
                  i === bgIndex
                    ? "border-accent-deep"
                    : "border-transparent hover:border-linen"
                )}
              >
                <span className={cn("h-4 w-4 rounded-full border border-black/10", preset.swatch)} />
                <span className="font-sans">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {CATEGORIES.map((category) => (
        <section key={category.title} className="mb-12">
          <h2 className="h5 mb-4 flex items-baseline gap-3">
            {category.title}
            <span className="text-sm font-sans font-normal text-ink/50">
              {category.items.length}
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {category.items.map(({ name, Comp }) => (
              <figure
                key={name}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-lg border border-black/5 p-5 transition-smooth",
                  bg.surface,
                  bg.foreground
                )}
              >
                <Comp size={120} title={name} className="shrink-0" />
                <figcaption className="text-center text-xs font-sans font-medium tracking-wide opacity-70">
                  {name}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
