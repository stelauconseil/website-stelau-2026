import { gsap } from "gsap";
import type { Badge, Token } from "./dom";
import { EASE_IN, EASE_INOUT, EASE_OUT, F, GLYPHS, SECONDARY_OPACITY } from "./theme";

type TL = gsap.core.Timeline;
const NO = { immediateRender: false } as const;
const FADE = F(16);
const VISIBLE = { opacity: 1, scale: 1, filter: "blur(0px)" };
const HIDDEN = { opacity: 0, scale: 0.82, filter: "blur(5px)" };

/** Pose une donnée, visible, à la position x (instantané). */
export const place = (tl: TL, t: Token, at: number, x: number, extra: gsap.TweenVars = {}) =>
  tl.set(t.el, { x, ...VISIBLE, ...extra }, at);

export const hide = (tl: TL, t: Token, at: number) => tl.set(t.el, { opacity: 0 }, at);

/**
 * Déplacement d'une donnée entre deux images (repère 60 fps).
 * absorb : elle « entre » dans la primitive ; emerge : elle en sort.
 */
export const travel = (
  tl: TL,
  t: Token,
  f0: number,
  f1: number,
  x0: number,
  x1: number,
  o: { absorb?: boolean; emerge?: boolean; ease?: string } = {},
) => {
  const at = F(f0);
  const dur = F(f1 - f0);
  const ease = o.ease ?? (o.emerge ? EASE_OUT : EASE_INOUT);
  tl.fromTo(t.el, { x: x0 }, { x: x1, duration: dur, ease, ...NO }, at);
  if (o.emerge)
    tl.fromTo(t.el, HIDDEN, { ...VISIBLE, duration: FADE, ease: "power3.out", ...NO }, at);
  else tl.set(t.el, VISIBLE, at);
  if (o.absorb)
    tl.fromTo(t.el, VISIBLE, { ...HIDDEN, duration: FADE, ease: EASE_IN, ...NO }, at + dur - FADE);
  return tl;
};

/** Fondu sur place. */
export const fade = (tl: TL, t: Token, f0: number, f1: number, dir: "in" | "out", x?: number) => {
  const from = dir === "in" ? { opacity: 0, scale: 0.94, filter: "blur(4px)" } : VISIBLE;
  const to = dir === "in" ? VISIBLE : { opacity: 0, scale: 0.94, filter: "blur(4px)" };
  if (x !== undefined) tl.set(t.el, { x }, F(f0));
  return tl.fromTo(
    t.el,
    from,
    { ...to, duration: F(f1 - f0), ease: dir === "in" ? "power3.out" : EASE_IN, ...NO },
    F(f0),
  );
};

/** Impulsion de la primitive : rebond, onde de choc, calque secondaire qui s'illumine. */
export const hit = (tl: TL, b: Badge, f: number) => {
  const at = F(f);
  tl.fromTo(
    b.el,
    { scale: 1 },
    { scale: 1.045, duration: 0.13, ease: "power2.out", yoyo: true, repeat: 1, ...NO },
    at,
  );
  tl.set(b.ring, { opacity: 0.34, scale: 1 }, at);
  tl.to(b.ring, { opacity: 0, scale: 1.18, duration: 0.65, ease: "power2.out" }, at);
  tl.fromTo(
    b.sec,
    { opacity: SECONDARY_OPACITY },
    { opacity: 0.78, duration: 0.16, ease: "sine.inOut", yoyo: true, repeat: 1, ...NO },
    at,
  );
  return tl;
};

/** Brouillage du texte d'un chip vers `text`. */
export const scramble = (
  tl: TL,
  t: Token,
  f0: number,
  f1: number,
  text: string,
  chars = GLYPHS,
  kind?: string,
) => {
  if (kind) tl.set(t.chip, { attr: { "data-kind": kind } }, F(f0));
  return tl.to(
    t.chip,
    {
      duration: F(f1 - f0),
      ease: "none",
      scrambleText: { text, chars, revealDelay: 0, speed: 0.9, tweenLength: true },
    },
    F(f0),
  );
};

/** Remet le texte d'un chip (sans animation) — début de boucle. */
export const setText = (tl: TL, t: Token, at: number, text: string, kind?: string) => {
  tl.set(t.chip, { textContent: text, ...(kind ? { attr: { "data-kind": kind } } : {}) }, at);
  return tl;
};

/** Traînée lumineuse entre la primitive (x0) et la donnée, qui s'estompe. */
export const follow = (
  tl: TL,
  trailEl: HTMLElement,
  t: Token,
  x0: number,
  f0: number,
  f1: number,
  offset = 0,
) => {
  const color = trailEl.dataset.color ?? "#334155";
  tl.set(trailEl, { opacity: 0.55 }, F(f0));
  return tl.to(
    trailEl,
    {
      opacity: 0,
      duration: F(f1 - f0),
      ease: "power1.in",
      onUpdate() {
        const x = (gsap.getProperty(t.el, "x") as number) + offset;
        const l = Math.min(x0, x);
        trailEl.style.left = `${l}px`;
        trailEl.style.width = `${Math.abs(x - x0)}px`;
        trailEl.style.background = `linear-gradient(${x > x0 ? "to right" : "to left"}, transparent, ${color})`;
      },
    },
    F(f0),
  );
};

export const crossfade = (tl: TL, a: Element, b: Element, f0: number, f1: number) => {
  tl.to(a, { opacity: 0, duration: F(f1 - f0), ease: "sine.inOut" }, F(f0));
  tl.to(b, { opacity: 1, duration: F(f1 - f0), ease: "sine.inOut" }, F(f0));
  return tl;
};
