// Un tour d'AES, en direct (lib/aes.js, exemple FIPS-197 annexe B) : la confusion et la diffusion
// de Shannon sont toujours au cœur du chiffrement symétrique moderne.
//   arrivée : l'état = le bloc clair (16 octets en 4 × 4)
//   clic 1  AddRoundKey : chaque case bascule sur octet ⊕ clé
//   clic 2  SubBytes : chaque octet passe par la boîte S (confusion), la table s'allume
//   clic 3  ShiftRows : les lignes glissent réellement de 0, 1, 2, 3 cases (permutation)
//   clic 4  MixColumns : colonne par colonne, les 4 octets changent ensemble (diffusion)
//   clic 5  AddRoundKey puis les 9 autres tours défilent jusqu'au chiffré de la norme
//   clic 6  avalanche : 1 bit du clair change, ~ la moitié des bits du chiffré changent
import { gsap } from "gsap";
import { encryptTrace, fromHex, SBOX } from "../../../lib/aes.js";
import { bitDiff, toHex } from "../../../lib/hash.js";

const PT = fromHex("3243f6a8885a308d313198a2e0370734");
const KEY = fromHex("2b7e151628aed2a6abf7158809cf4f3c");
const CELL = 116,
  GAP = 12,
  STEP = CELL + GAP;
const hx = (v) => v.toString(16).padStart(2, "0");
// 16 octets → deux lignes de 2 × 4 octets (tient dans le panneau de droite)
const group = (b) =>
  toHex(b)
    .match(/.{8}/g)
    .map((g, i) => (i === 1 ? g + "\n" : g + " "))
    .join("")
    .trimEnd();

export default function (sec, { printing }) {
  const trace = encryptTrace(PT, KEY);
  const PT2 = Uint8Array.from(PT);
  PT2[0] ^= 0x01; // un seul bit
  const trace2 = encryptTrace(PT2, KEY);
  const ct = trace.at(-1).state,
    ct2 = trace2.at(-1).state;
  const find = (r, step) => trace.findIndex((t) => t.round === r && t.step === step);
  // État affiché à chaque étape (indices dans la trace)
  const AT = [
    0,
    find(0, "addRoundKey"),
    find(1, "subBytes"),
    find(1, "shiftRows"),
    find(1, "mixColumns"),
    trace.length - 1,
  ];
  const OPS = [null, "addRoundKey", "subBytes", "shiftRows", "mixColumns", null, null];

  // --- Grille : 16 cases positionnées en absolu ; el[i] = case de l'octet i (ligne i % 4, colonne i >> 2)
  const grid = sec.querySelector(".ac-grid");
  const pos = (i) => ({ x: (i >> 2) * STEP, y: (i % 4) * STEP });
  let el = Array.from({ length: 16 }, (_, i) => {
    const d = document.createElement("span");
    d.className = "ac-cell";
    grid.appendChild(d);
    gsap.set(d, pos(i));
    return d;
  });
  const show = (state) => el.forEach((d, i) => (d.textContent = hx(state[i])));
  const reset = () => {
    // remet les cases dans l'ordre des positions (après un ShiftRows animé)
    const cells = [...grid.children];
    cells.forEach((d) => gsap.killTweensOf(d));
    el = cells;
    el.forEach((d, i) => {
      gsap.set(d, { ...pos(i), opacity: 1, rotationX: 0, scale: 1 });
      d.className = "ac-cell";
    });
  };

  // --- Panneaux et liste des opérations
  const ops = [...sec.querySelectorAll(".ac-op")];
  const loop = sec.querySelector(".ac-loop");
  const panels = [...sec.querySelectorAll(".ac-panel")];
  const roundEl = sec.querySelector(".ac-round"),
    stepEl = sec.querySelector(".ac-step");
  const $ = (s) => sec.querySelector(s);
  $(".ac-pt").textContent = group(PT);
  $(".ac-k").textContent = group(KEY);
  $(".ac-ct").textContent = group(ct);
  $(".ac-x1").textContent = `${hx(PT[0])} ⊕ ${hx(KEY[0])} = ${hx(trace[AT[1]].state[0])}`;
  const b = trace[AT[1]].state[0];
  $(".ac-s1").textContent = `S(${hx(b)}) = ${hx(SBOX[b])}`;
  // MixColumns : une ligne du produit matriciel (premier octet de la première colonne)
  const sh = trace[AT[3]].state,
    mx = trace[AT[4]].state;
  $(".ac-m1").textContent =
    `${hx(mx[0])} = 2·${hx(sh[0])} ⊕ 3·${hx(sh[1])} ⊕ ${hx(sh[2])} ⊕ ${hx(sh[3])}`;
  // Avalanche : chiffrés, chiffres hexadécimaux qui diffèrent mis en évidence
  const diffHex = (a, z) =>
    group(z)
      .split("")
      .map((ch, i) => {
        const ref = group(a)[i];
        return ch !== ref && ch !== " " && ch !== "\n" ? `<mark>${ch}</mark>` : ch;
      })
      .join("");
  $(".ac-pt2").innerHTML = diffHex(PT, PT2);
  $(".ac-c1").textContent = group(ct);
  $(".ac-c2").innerHTML = diffHex(ct, ct2);
  $(".ac-nb").textContent = bitDiff(ct, ct2);

  // Boîte S miniature (16 × 16) : la ligne et la colonne de l'octet lu s'allument
  const sb = $(".ac-sbox");
  sb.innerHTML = Array.from(
    { length: 256 },
    (_, v) => `<i title="${hx(v)} → ${hx(SBOX[v])}"></i>`,
  ).join("");
  const sCells = [...sb.children];
  const sMark = (v, on) => {
    sCells.forEach((c, k) => {
      c.classList.toggle("ac-row", on && k >> 4 === v >> 4);
      c.classList.toggle("ac-col", on && (k & 15) === (v & 15));
      c.classList.toggle("ac-hit", on && k === v);
    });
  };

  const decorate = (n) => {
    ops.forEach((o) => o.classList.toggle("on", o.dataset.op === OPS[n]));
    loop.classList.toggle("on", n === 5);
    panels.forEach((p) => p.classList.toggle("on", Number(p.dataset.p) === n));
    const t = n >= 5 ? trace.at(-1) : trace[AT[n]];
    roundEl.textContent =
      n === 0 ? "Clair" : n >= 5 ? (n === 6 ? "Chiffré′" : "Chiffré") : `Tour ${t.round}`;
    stepEl.textContent = n === 0 || n >= 5 ? "" : t.step;
    sMark(b, n === 2);
  };

  // Rendu instantané (retour arrière, impression)
  const instant = (n) => {
    tl?.kill();
    reset();
    show(n === 6 ? ct2 : trace[AT[Math.min(n, 5)]].state);
    if (n === 6) el.forEach((d, i) => d.classList.toggle("ac-chg", ct2[i] !== ct[i]));
    if (n === 5) el.forEach((d) => d.classList.add("ac-done"));
    decorate(n);
  };

  // --- Animations
  let tl,
    cur = 0;
  const flipTo = (state, cls, stagger = 0.05) => {
    const t = gsap.timeline();
    el.forEach((d, i) => {
      const at = i * stagger;
      t.to(d, { rotationX: 90, duration: 0.16, ease: "power1.in" }, at);
      t.add(() => {
        d.textContent = hx(state[i]);
        if (cls) d.classList.add(cls);
      }, at + 0.16);
      t.to(d, { rotationX: 0, duration: 0.22, ease: "back.out(2)" }, at + 0.16);
    });
    if (cls) t.add(() => el.forEach((d) => d.classList.remove(cls)), "+=0.5");
    return t;
  };
  // ShiftRows : ligne après ligne, lentement ; les octets qui sortent à gauche se soulèvent,
  // survolent la ligne et reviennent se poser à droite pendant que les autres glissent.
  const shiftRowsAnim = () => {
    const t = gsap.timeline();
    const next = Array.from({ length: 16 });
    el.forEach((d, i) => {
      const r = i % 4,
        c = i >> 2;
      const nc = (c - r + 4) % 4;
      next[r + 4 * nc] = d;
      if (!r) return;
      const at = (r - 1) * 1.7;
      const y = r * STEP;
      t.add(() => d.classList.add("ac-moving"), at);
      if (nc < c) t.to(d, { x: nc * STEP, duration: 1, ease: "power2.inOut" }, at + 0.35);
      else
        t.to(
          d,
          {
            keyframes: [
              { y: y - 74, scale: 1.12, zIndex: 5, duration: 0.35, ease: "power2.out" },
              { x: nc * STEP, duration: 1, ease: "power2.inOut" },
              { y, scale: 1, duration: 0.35, ease: "bounce.out" },
            ],
          },
          at,
        );
      t.add(() => d.classList.remove("ac-moving"), at + 1.8);
      t.set(d, { zIndex: "" }, at + 1.8);
    });
    t.add(() => (el = next));
    return t;
  };
  const mixAnim = (state) => {
    const t = gsap.timeline();
    for (let c = 0; c < 4; c++) {
      const col = el.slice(4 * c, 4 * c + 4);
      const at = c * 0.55;
      t.add(() => col.forEach((d) => d.classList.add("ac-mixing")), at);
      col.forEach((d, k) => {
        t.to(d, { scale: 1.08, duration: 0.15, yoyo: true, repeat: 1 }, at + 0.1);
        t.add(() => (d.textContent = hx(state[4 * c + k])), at + 0.25);
      });
      t.add(() => col.forEach((d) => d.classList.remove("ac-mixing")), at + 0.55);
    }
    return t;
  };
  // Défilement rapide d'une trace (tours suivants), en finissant sur le dernier état
  const fastForward = (tr, from, onEnd) => {
    const t = gsap.timeline();
    for (let k = from; k < tr.length; k++) {
      const at = (k - from) * 0.08;
      t.add(() => {
        show(tr[k].state);
        roundEl.textContent = `Tour ${tr[k].round}`;
        stepEl.textContent = tr[k].step;
        el.forEach((d) => d.classList.toggle("ac-flash", k % 2 === 0));
      }, at);
    }
    t.add(() => {
      el.forEach((d) => d.classList.remove("ac-flash"));
      onEnd();
    });
    return t;
  };

  const forward = (n) => {
    tl?.progress(1).kill(); // termine l'étape précédente (positions et états cohérents)
    decorate(n);
    if (n === 1) tl = flipTo(trace[AT[1]].state, "ac-keyed");
    else if (n === 2) tl = flipTo(trace[AT[2]].state, "ac-subst", 0.06);
    else if (n === 3) tl = shiftRowsAnim();
    else if (n === 4) tl = mixAnim(trace[AT[4]].state);
    else if (n === 5) {
      roundEl.textContent = "Tour 1";
      tl = fastForward(trace, AT[4] + 1, () => {
        decorate(5);
        el.forEach((d) => d.classList.add("ac-done"));
        gsap.fromTo(
          el,
          { scale: 0.85 },
          { scale: 1, duration: 0.5, ease: "back.out(3)", stagger: 0.02 },
        );
      });
    } else if (n === 6) {
      el.forEach((d) => d.classList.remove("ac-done"));
      tl = fastForward(trace2, 0, () => {
        decorate(6);
        el.forEach((d, i) => d.classList.toggle("ac-chg", ct2[i] !== ct[i]));
      });
    }
  };

  instant(0);
  return {
    enter() {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(2)",
          stagger: { each: 0.03, from: "random" },
        },
      );
    },
    step(n) {
      if (n === cur + 1 && !printing) forward(n);
      else instant(n);
      cur = n;
    },
    leave() {
      tl?.progress(1);
    },
    final() {
      instant(6);
    },
  };
}
