import { icons } from "./icons";
import { BADGE_PT, CY, LANE_W, SECONDARY_OPACITY, fonts, ui, type Primitive } from "./theme";

type Attrs = Record<string, string | number | undefined>;

export const h = (
  tag: string,
  cls?: string,
  style?: Partial<CSSStyleDeclaration> | string,
  html?: string,
) => {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (typeof style === "string") el.setAttribute("style", style);
  else if (style) Object.assign(el.style, style);
  if (html !== undefined) el.innerHTML = html;
  return el;
};

const SVGNS = "http://www.w3.org/2000/svg";
const svgEl = (tag: string, attrs: Attrs) => {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined) continue;
    // var(--…) n'est pas reconnu dans un attribut de présentation SVG : on passe par le style
    if (typeof v === "string" && v.startsWith("var(")) el.style.setProperty(k, v);
    else el.setAttribute(k, String(v));
  }
  return el;
};

/** Icône duotone : renvoie le <svg> et le calque secondaire (pour l'animer). */
export const duoIcon = (name: string, color: string, height: number) => {
  const icon = icons[name];
  if (!icon) throw new Error(`Icône inconnue : ${name}`);
  const width = (height * icon.width) / icon.height;
  const svg = svgEl("svg", {
    viewBox: `0 0 ${icon.width} ${icon.height}`,
    width,
    height,
    "aria-hidden": "true",
  });
  svg.style.overflow = "visible";
  svg.style.display = "block";
  const sec = svgEl("g", { fill: color });
  sec.style.opacity = String(SECONDARY_OPACITY);
  icon.secondary.forEach((d) => sec.appendChild(svgEl("path", { d })));
  const pri = svgEl("g", { fill: color });
  icon.primary.forEach((d) => pri.appendChild(svgEl("path", { d })));
  svg.append(sec, pri);
  return { svg, sec };
};

export type Badge = { el: HTMLElement; ring: HTMLElement; sec: SVGGElement; w: number };

/** Badge reconstruit au point près (cf. version Remotion). */
export const badge = (p: Primitive, x: number, y = CY, hgt = 64): Badge => {
  const k = hgt / BADGE_PT.h;
  const w = BADGE_PT.w * k;
  const r = BADGE_PT.radius * BADGE_PT.h * k;
  const sw = BADGE_PT.stroke * k;
  const [ix, iy, iw, ih] = p.iconBox.map((v) => v * k);
  const el = h("div", "cp-badge", {
    left: `${x - w / 2}px`,
    top: `${y - hgt / 2}px`,
    width: `${w}px`,
    height: `${hgt}px`,
  });
  const ring = h("div", "cp-ring", {
    inset: `${-sw / 2 - 2}px`,
    borderRadius: `${r + sw / 2 + 2}px`,
    border: `2px solid ${p.color}`,
  });
  const iconBox = h("div", "", {
    position: "absolute",
    left: `${ix}px`,
    top: `${iy}px`,
    width: `${iw}px`,
    height: `${ih}px`,
  });
  const { svg, sec } = duoIcon(p.icon, p.iconColor, ih);
  iconBox.appendChild(svg);
  const face = h("div", "cp-face", {
    inset: `${-sw / 2}px`,
    border: `${sw}px solid #FFFFFF`,
    borderRadius: `${r + sw / 2}px`,
    background: p.color,
    boxShadow: `0 ${1.575 * k}px ${3.15 * k}px rgba(0,0,0,.38)`,
    fontSize: `${p.fontPt * k}px`,
  });
  face.textContent = p.label;
  el.append(ring, iconBox, face);
  return { el, ring, sec: sec as SVGGElement, w };
};

export type Token = { el: HTMLElement; chip: HTMLElement; caption?: HTMLElement };

/** Donnée en circulation : un conteneur sans taille (positionné en x) + un chip centré. */
export const token = (
  text: string,
  kind = "plain",
  color: string = ui.ink,
  opts: { minWidth?: number; caption?: string } = {},
): Token => {
  const el = h("div", "cp-tok");
  el.style.opacity = "0";
  const chip = h("div", "cp-chip");
  chip.dataset.kind = kind;
  chip.style.setProperty("--c", color);
  if (opts.minWidth) chip.style.minWidth = `${opts.minWidth}px`;
  chip.textContent = text;
  el.appendChild(chip);
  let caption: HTMLElement | undefined;
  if (opts.caption) {
    caption = h("div", "cp-caption");
    caption.textContent = opts.caption;
    el.appendChild(caption);
  }
  return { el, chip, caption };
};

/** Accolade fine avec étiquette ; `labels` permet un fondu entre deux libellés (C ↔ S). */
export const bracket = (
  x: number,
  w: number,
  labels: string[],
  opts: { small?: boolean; top?: number } = {},
) => {
  const el = h("div", `cp-bracket${opts.small ? " cp-small" : ""}`, {
    left: `${x - w / 2}px`,
    width: `${w}px`,
  });
  if (opts.top !== undefined) el.style.top = `${opts.top}px`;
  const svg = svgEl("svg", { width: w, height: 12 });
  svg.appendChild(
    svgEl("path", {
      d: `M1 0 V4 Q1 6 3 6 H${w / 2 - 6} Q${w / 2} 6 ${w / 2} 11 Q${w / 2} 6 ${w / 2 + 6} 6 H${w - 3} Q${w - 1} 6 ${w - 1} 4 V0`,
      fill: "none",
      stroke: ui.faint,
      "stroke-width": 1.5,
      "stroke-linecap": "round",
    }),
  );
  const wrap = h("div", "cp-blabel");
  const items = labels.map((t, i) => {
    const s = h(
      "span",
      "",
      i === 0 ? {} : { position: "absolute", left: "0", right: "0", top: "0", opacity: "0" },
    );
    s.textContent = t;
    wrap.appendChild(s);
    return s;
  });
  el.append(svg, wrap);
  return { el, labels: items };
};

export const trail = (color: string) => {
  const el = h("div", "cp-trail");
  el.dataset.color = color;
  return el;
};

export const hint = (x: number, text: string, color: string) => {
  const el = h("div", "cp-hint", { left: `${x - 120}px`, color });
  el.textContent = text;
  return el;
};

export const person = (x: number, name: string, icon: string, color: string, note: string) => {
  const el = h("div", "cp-person", { left: `${x - 60}px` });
  const ic = h("div", "", { display: "flex", justifyContent: "center" });
  const { svg, sec } = duoIcon(icon, color, 72);
  ic.appendChild(svg);
  const nm = h("div", "cp-pname", undefined, `${name} <span class="cp-pnote">· ${note}</span>`);
  el.append(ic, nm);
  return { el, icon: ic, sec: sec as SVGGElement };
};

/** Carte d'une ligne : libellé + rail pointillé. */
export const lane = (
  label: string,
  color: string,
  sub?: HTMLElement | string,
  rail: [number, number] = [150, LANE_W - 150],
) => {
  const el = h("div", "cp-lane"); // pas de <section> : reveal.js les prendrait pour des planches;
  el.setAttribute("aria-label", label);
  const lab = h("div", "cp-label");
  lab.append(
    h("span", "cp-dot", { background: color }),
    Object.assign(h("span"), { textContent: label }),
  );
  if (sub) {
    const s =
      typeof sub === "string" ? Object.assign(h("span", "cp-sub"), { textContent: sub }) : sub;
    lab.append(s);
  }
  const svg = svgEl("svg", { class: "cp-rail", width: LANE_W, height: 188 });
  svg.append(
    svgEl("line", {
      x1: rail[0],
      x2: rail[1],
      y1: CY,
      y2: CY,
      stroke: ui.rail,
      "stroke-width": 1.5,
      "stroke-dasharray": "2 7",
      "stroke-linecap": "round",
    }),
    svgEl("circle", { cx: rail[0], cy: CY, r: 3, fill: ui.faint }),
    svgEl("circle", { cx: rail[1], cy: CY, r: 3, fill: ui.faint }),
  );
  el.append(lab, svg);
  return el;
};

export const subSwap = (a: string, b: string) => {
  const s = h("span", "cp-sub", { display: "inline-block", width: "220px", height: "13px" });
  const sa = h("span", "", { position: "absolute", left: "0", top: "0" });
  sa.textContent = a;
  const sb = h("span", "", { position: "absolute", left: "0", top: "0", opacity: "0" });
  sb.textContent = b;
  s.append(sa, sb);
  return { el: s, a: sa, b: sb };
};

export { fonts };
