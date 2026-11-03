// Brouillage de texte, version minimale de ScrambleTextPlugin (payant dans GSAP 3.12, la version
// du dépôt) : même interface, { text, chars, tweenLength }. Les caractères se fixent de gauche à
// droite ; le reste défile au hasard. Rendu exact à 0 (texte d'origine) et à 1 (texte final).
import { gsap } from "gsap";

type Data = { t: HTMLElement; from: string; to: string; chars: string; tweenLength: boolean };

const pick = (chars: string) => chars[(Math.random() * chars.length) | 0];

export const ScramblePlugin = {
  name: "scrambleText",
  init(
    this: Data,
    target: HTMLElement,
    v: { text: string; chars?: string; tweenLength?: boolean },
  ) {
    this.t = target;
    this.from = target.textContent ?? "";
    this.to = v.text;
    this.chars = v.chars || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    this.tweenLength = v.tweenLength !== false;
  },
  render(ratio: number, d: Data) {
    if (ratio <= 0) return void (d.t.textContent = d.from);
    if (ratio >= 1) return void (d.t.textContent = d.to);
    const len = d.tweenLength
      ? Math.round(d.from.length + (d.to.length - d.from.length) * ratio)
      : d.to.length;
    const fixed = Math.floor(d.to.length * ratio);
    let s = d.to.slice(0, Math.min(fixed, len));
    for (let i = s.length; i < len; i++) s += d.to[i] === " " ? " " : pick(d.chars);
    d.t.textContent = s;
  },
};

let done = false;
export const registerScramble = () => {
  if (done) return;
  gsap.registerPlugin(ScramblePlugin as unknown as gsap.Plugin);
  done = true;
};
