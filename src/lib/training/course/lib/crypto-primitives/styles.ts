import { CY, LANE_H, LANE_W, STAGE_W, fonts, ui } from "./theme";

/** Feuille de style injectée une seule fois (préfixe cp-). */
export const CSS = /* css */ `
.cp-root{position:relative;width:100%;overflow:hidden;contain:layout paint;}
.cp-root.cp-bg{background-color:${ui.bg};background-image:radial-gradient(${ui.dot} 1.2px,transparent 1.3px);background-size:28px 28px;background-position:14px 14px;}
.cp-stage{position:absolute;left:0;top:0;width:${STAGE_W}px;transform-origin:0 0;}
.cp-lane{position:absolute;left:${(STAGE_W - LANE_W) / 2}px;width:${LANE_W}px;height:${LANE_H}px;background:${ui.card};border-radius:22px;border:1px solid ${ui.cardBorder};box-shadow:0 1px 2px rgba(15,23,42,.04),0 12px 32px -18px rgba(15,23,42,.18);overflow:hidden;}
.cp-label{position:absolute;left:28px;top:20px;display:flex;align-items:center;gap:10px;font:400 13px/1 ${fonts.mono};letter-spacing:.14em;text-transform:uppercase;color:${ui.muted};white-space:nowrap;}
.cp-label .cp-dot{width:7px;height:7px;border-radius:4px;}
.cp-label .cp-sub{color:${ui.inkSoft};position:relative;}
.cp-rail{position:absolute;inset:0;pointer-events:none;}
.cp-bracket{position:absolute;top:${CY + 36}px;}
.cp-bracket svg{display:block;overflow:visible;}
.cp-bracket .cp-blabel{position:relative;text-align:center;margin-top:3px;font:300 24px/1 ${fonts.sans};color:${ui.muted};}
.cp-bracket.cp-small .cp-blabel{font:300 15px/1 ${fonts.mono};letter-spacing:.08em;}
.cp-tok{position:absolute;left:0;top:${CY}px;width:0;height:0;will-change:transform,opacity,filter;}
.cp-chip{position:absolute;left:0;top:0;transform:translate(-50%,-50%);white-space:pre;display:flex;align-items:center;justify-content:center;height:52px;padding:0 22px;border-radius:26px;font:500 29px/1 ${fonts.sans};letter-spacing:-.005em;color:${ui.ink};font-variant-numeric:tabular-nums;background:${ui.card};border:1px solid ${ui.cardBorder};box-shadow:0 1px 2px rgba(15,23,42,.06);}
.cp-chip[data-kind=cipher]{font:500 27px/1 ${fonts.mono};letter-spacing:.02em;color:var(--c);background:color-mix(in srgb,var(--c) 6%,${ui.card});border-color:color-mix(in srgb,var(--c) 28%,${ui.card});box-shadow:none;}
.cp-chip[data-kind=number]{font:500 27px/1 ${fonts.mono};letter-spacing:.02em;}
.cp-chip[data-kind=hash]{height:46px;padding:0 20px;border-radius:8px;font:500 22px/1 ${fonts.mono};letter-spacing:.02em;color:var(--c);background:${ui.hashBox};border:1.5px dashed color-mix(in srgb,var(--c) 45%,${ui.card});box-shadow:none;}
.cp-chip[data-kind=secret]{font:600 27px/1 ${fonts.mono};color:var(--c);background:color-mix(in srgb,var(--c) 9%,${ui.card});border:1.5px solid color-mix(in srgb,var(--c) 45%,${ui.card});box-shadow:0 6px 18px color-mix(in srgb,var(--c) 18%,transparent);}
.cp-caption{position:absolute;left:-100px;width:200px;top:36px;text-align:center;font:400 15px/1 ${fonts.mono};letter-spacing:.08em;color:${ui.muted};}
.cp-trail{position:absolute;top:${CY - 1.5}px;height:3px;border-radius:2px;opacity:0;width:0;}
.cp-badge{position:absolute;will-change:transform;}
.cp-badge .cp-ring{position:absolute;opacity:0;pointer-events:none;}
.cp-badge .cp-face{position:absolute;box-sizing:border-box;display:flex;align-items:center;justify-content:center;color:#fff;font-family:${fonts.badge};font-weight:400;line-height:1;}
.cp-hint{position:absolute;top:${CY + 50}px;width:160px;text-align:center;font:400 13px/1 ${fonts.mono};letter-spacing:.06em;}
.cp-person{position:absolute;top:${CY - 46}px;width:120px;text-align:center;}
.cp-person .cp-pname{margin-top:8px;font:400 13px/1 ${fonts.mono};letter-spacing:.1em;color:${ui.muted};text-transform:uppercase;}
.cp-person .cp-pnote{color:${ui.faint};text-transform:none;}
.cp-pulse-dot{position:absolute;top:${CY - 5}px;left:0;width:10px;height:10px;margin-left:-5px;border-radius:5px;opacity:0;}
@media (prefers-reduced-motion: reduce){.cp-tok,.cp-badge{will-change:auto;}}
`;

let injected = false;
export const injectStyles = () => {
  if (injected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.dataset.cryptoPrimitives = "";
  s.textContent = CSS;
  document.head.appendChild(s);
  injected = true;
};
