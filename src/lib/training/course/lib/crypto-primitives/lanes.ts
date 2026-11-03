import { gsap } from "gsap";
import { badge, bracket, hint, lane, person, subSwap, token, trail, h } from "./dom";
import { crossfade, fade, follow, hit, place, scramble, setText, travel } from "./fx";
import { CY, EASE_INOUT, F, HEX, fonts, people, primitives, ui } from "./theme";

export type LaneBuild = {
  el: HTMLElement;
  tl: gsap.core.Timeline;
  poster: number;
  stop?: () => void;
};

const loop = (dur: number) =>
  gsap.timeline({ repeat: -1, defaults: { overwrite: false } }).set({}, {}, F(dur));

// ───────────────────────────── AES ─────────────────────────────
export const aesLane = (): LaneBuild => {
  const P = primitives.aes;
  const M = 560,
    B = 896,
    C = 1236;
  const el = lane("Chiffrement symétrique", P.ink);
  const tok = token("Hello !");
  const tr = trail(ui.inkSoft);
  const b = badge(P, B);
  el.append(bracket(M, 210, ["M"]).el, bracket(C, 230, ["C"]).el, tr, tok.el, b.el);

  const tl = loop(480);
  setText(tl, tok, 0, "Hello !", "plain");
  place(tl, tok, 0, M);
  travel(tl, tok, 40, 110, M, B, { absorb: true });
  hit(tl, b, 104);
  travel(tl, tok, 118, 200, B, C, { emerge: true });
  scramble(tl, tok, 118, 176, "h7f9ABU", undefined, "cipher");
  follow(tl, tr, tok, B + 70, 118, 230);
  travel(tl, tok, 262, 332, C, B, { absorb: true });
  hit(tl, b, 326);
  travel(tl, tok, 340, 422, B, M, { emerge: true });
  scramble(tl, tok, 340, 398, "Hello !", undefined, "plain");
  follow(tl, tr, tok, B - 70, 340, 450);
  tok.chip.style.setProperty("--c", P.ink);
  return { el, tl, poster: F(230) };
};

// ───────────────────────────── RSA ─────────────────────────────
export const rsaLane = (): LaneBuild => {
  const PUB = primitives.rsaPub,
    PRIV = primitives.rsaPriv;
  const M1 = 300,
    KPUB = 620,
    C = 960,
    KPRIV = 1300,
    M2 = 1620;
  const mode = subSwap("· chiffrement", "· signature");
  const el = lane("Chiffrement asymétrique", PUB.color, mode.el);
  const tok = token("le secret", "plain", PUB.ink);
  const tr = trail(PUB.color);
  const bPub = badge(PUB, KPUB);
  const bPriv = badge(PRIV, KPRIV);
  const bc = bracket(C, 240, ["C", "S"]);
  el.append(
    bracket(M1, 200, ["M"]).el,
    bc.el,
    bracket(M2, 200, ["M"]).el,
    hint(KPUB, "clé publique", PUB.iconColor),
    hint(KPRIV, "clé privée", PRIV.iconColor),
    tr,
    tok.el,
    bPub.el,
    bPriv.el,
  );

  const tl = loop(960);
  const half = (
    o: number,
    a: number,
    k1: number,
    k2: number,
    b: number,
    b1: typeof bPub,
    b2: typeof bPub,
    cipher: string,
    c1: string,
    c2: string,
  ) => {
    // c1 : couleur de la clé qui chiffre (le chiffré prend sa couleur), c2 : celle qui déchiffre
    const d = Math.sign(b - a);
    setText(tl, tok, F(o), "le secret", "plain");
    tl.set(tok.chip, { "--c": c1 }, F(o));
    place(tl, tok, F(o), a);
    travel(tl, tok, o + 40, o + 110, a, k1, { absorb: true });
    hit(tl, b1, o + 104);
    travel(tl, tok, o + 118, o + 200, k1, C, { emerge: true });
    scramble(tl, tok, o + 118, o + 176, cipher, undefined, "cipher");
    tr.dataset.color = c1;
    follow(tl, tr, tok, k1 + d * 70, o + 118, o + 230);
    travel(tl, tok, o + 240, o + 310, C, k2, { absorb: true });
    hit(tl, b2, o + 306);
    travel(tl, tok, o + 318, o + 400, k2, b, { emerge: true });
    scramble(tl, tok, o + 318, o + 380, "le secret", undefined, "plain");
    tr.dataset.color = c2;
    follow(tl, tr, tok, k2 + d * 70, o + 318, o + 420);
  };
  // Chiffré vert quand il sort de la clé publique, rouge quand il sort de la clé privée
  const GREEN = "var(--cp-rsa-pub, #4E9A1E)",
    RED = PRIV.ink;
  half(0, M1, KPUB, KPRIV, M2, bPub, bPriv, "h&9p23oM", GREEN, RED); // chiffrement : publique → privée
  half(480, M2, KPRIV, KPUB, M1, bPriv, bPub, "v14up@Re", RED, GREEN); // signature : privée → publique
  crossfade(tl, mode.a, mode.b, 450, 480);
  crossfade(tl, bc.labels[0], bc.labels[1], 450, 480);
  crossfade(tl, mode.b, mode.a, 930, 960);
  crossfade(tl, bc.labels[1], bc.labels[0], 930, 960);
  return { el, tl, poster: F(220) };
};

// ───────────────────────────── SHA ─────────────────────────────
export const shaLane = (): LaneBuild => {
  const P = primitives.sha;
  const M = 380,
    B = 720,
    H = 1236;
  const DIGEST = "56e3fbcc30d97dba881ea271ba0b4239281b766e"; // SHA-1("Hello !")
  const el = lane("Fonctions de hachage", P.color, "· SHA-1 · 160 bits");
  const msg = token("Hello !");
  const dig = token(DIGEST, "hash", P.ink, { minWidth: 600 });
  const tr = trail(P.color);
  const b = badge(P, B);
  const bh = bracket(H, 600, ["H(M)"]);
  bh.el.style.opacity = "0.35";
  el.append(bracket(M, 210, ["M"]).el, bh.el, tr, msg.el, dig.el, b.el);

  const tl = loop(480);
  place(tl, msg, 0, M);
  tl.set(dig.el, { opacity: 0 }, 0);
  setText(tl, dig, 0, "".padEnd(40, "0"));
  travel(tl, msg, 40, 110, M, B, { absorb: true });
  hit(tl, b, 104);
  travel(tl, dig, 118, 210, B + 240, H, { emerge: true });
  tl.to(
    dig.chip,
    {
      duration: F(116),
      ease: "none",
      scrambleText: { text: DIGEST, chars: HEX, revealDelay: 0, speed: 1 },
    },
    F(124),
  );
  follow(tl, tr, dig, B + 70, 118, 260, -300);
  tl.to(bh.el, { opacity: 1, duration: F(40) }, F(150));
  fade(tl, dig, 400, 440, "out");
  tl.to(bh.el, { opacity: 0.35, duration: F(40) }, F(400));
  fade(tl, msg, 440, 480, "in", M);
  return { el, tl, poster: F(300) };
};

// ───────────────────────────── DH ─────────────────────────────
export const dhLane = (): LaneBuild => {
  const P = primitives.dh;
  const ALICE = 190,
    BOB = 1602,
    A = 470,
    Bx = 1322,
    K = 896;
  const el = lane("Établissement de clé", P.color, "· Diffie-Hellman · p = 47, g = 26", [
    ALICE + 70,
    BOB - 70,
  ]);
  const alice = person(ALICE, "Alice", people.alice.icon, people.alice.color, "a = 7");
  const bob = person(BOB, "Bob", people.bob.icon, people.bob.color, "b = 41");
  const ga = token("26, 47, 10", "number", ui.ink, { caption: "g, p, A" });
  const gb = token("30", "number", ui.ink, { caption: "B", minWidth: 72 });
  const sA = token("44", "secret", P.color, { minWidth: 84 });
  const sB = token("44", "secret", P.color, { minWidth: 84 });
  const brA = bracket(A, 200, ["secret"], { top: CY + 40 });
  const brB = bracket(Bx, 200, ["secret"], { top: CY + 40 });
  brA.el.style.opacity = "0";
  brB.el.style.opacity = "0";
  const b = badge(P, K);
  el.append(alice.el, bob.el, brA.el, brB.el, ga.el, gb.el, sA.el, sB.el, b.el);

  const tl = loop(480);
  // A, g, p : Alice → Bob (valeurs publiques)
  place(tl, ga, 0, A);
  tl.set([gb.el, sA.el, sB.el], { opacity: 0 }, 0);
  travel(tl, ga, 30, 150, A, Bx, { ease: EASE_INOUT });
  hit(tl, b, 82);
  fade(tl, ga, 150, 190, "out");
  // B : Bob → Alice
  fade(tl, gb, 170, 200, "in", Bx);
  travel(tl, gb, 200, 320, Bx, A, { ease: EASE_INOUT });
  hit(tl, b, 252);
  fade(tl, gb, 320, 352, "out");
  // secret partagé recalculé de chaque côté
  const pop = (t: typeof sA, br: typeof brA, x: number, f: number, who: typeof alice) => {
    tl.set(t.el, { x }, F(f));
    tl.fromTo(
      t.el,
      { opacity: 0, scale: 0.7, filter: "blur(0px)" },
      { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(2.2)", immediateRender: false },
      F(f),
    );
    tl.to(br.el, { opacity: 1, duration: 0.4 }, F(f));
    tl.fromTo(
      who.icon,
      { scale: 1 },
      {
        scale: 1.07,
        duration: 0.18,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
        immediateRender: false,
      },
      F(f),
    );
    tl.fromTo(
      who.sec,
      { opacity: 0.4 },
      { opacity: 0.8, duration: 0.2, yoyo: true, repeat: 1, immediateRender: false },
      F(f),
    );
    tl.to([t.el, br.el], { opacity: 0, duration: F(22), ease: "power2.in" }, F(430));
  };
  pop(sA, brA, A, 352, alice);
  pop(sB, brB, Bx, 362, bob);
  fade(tl, ga, 450, 480, "in", A);
  return { el, tl, poster: F(400) };
};

// ───────────────────────────── PRNG ─────────────────────────────
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const prngLane = (): LaneBuild => {
  const P = primitives.prng;
  const SEED = "91690410bec9";
  const SEED_X = 420,
    K = 800,
    OUT0 = 1050,
    STEP = 124,
    SLOTS = 6;
  const r = mulberry32(parseInt(SEED.slice(0, 8), 16) ^ parseInt(SEED.slice(8), 16));
  const VALUES = Array.from({ length: 24 }, () => String(Math.floor(r() * 10000)).padStart(4, "0"));

  const el = lane("Générateurs d'aléa", P.color, "· déterministe : même graine, même suite");
  const seed = token(SEED, "number", ui.inkSoft);
  seed.el.style.opacity = "1";
  gsap.set(seed.el, { x: SEED_X });
  const dot = h("div", "cp-pulse-dot", {
    background: P.color,
    boxShadow: `0 0 12px 2px ${P.color}`,
  });
  const b = badge(P, K);
  const ell = h("div", "", {
    position: "absolute",
    left: "1660px",
    top: `${CY - 12}px`,
    font: `400 20px ${fonts.mono}`,
    color: ui.faint,
  });
  ell.textContent = "…";
  // emplacements de sortie : on recycle 6 chips
  const slots = Array.from({ length: SLOTS }, () => token("0000", "number", ui.ink));
  el.append(
    bracket(SEED_X, 250, ["graine"], { small: true }).el,
    bracket(1330, 600, ["aléa"], { small: true }).el,
    seed.el,
    dot,
    ...slots.map((s) => s.el),
    ell,
    b.el,
  );

  // Un cycle de 40 images : la graine « pulse », le PRNG émet, la file se décale.
  let n = 0;
  const xAt = (j: number) => (j === 0 ? OUT0 : OUT0 + STEP * j);
  const opAt = (x: number, j: number) =>
    Math.max(0, Math.min(1, (1680 - x) / 160)) * (j === 0 ? 1 : 0.55);
  const emit = () => {
    const fresh = slots[n % SLOTS];
    fresh.chip.textContent = VALUES[n % VALUES.length];
    fresh.chip.style.color = ui.ink;
    gsap.fromTo(
      fresh.el,
      { x: K + 70, opacity: 0, scale: 0.82, filter: "blur(4px)" },
      {
        x: OUT0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: F(26),
        ease: "expo.out",
        overwrite: true,
      },
    );
    for (let j = 1; j < SLOTS; j++) {
      const s = slots[(n - j + SLOTS * 100) % SLOTS];
      if (n - j < 0) continue;
      const x = xAt(j);
      s.chip.style.color = ui.muted;
      gsap.to(s.el, {
        x,
        opacity: opAt(x, j),
        scale: 0.9,
        filter: "blur(0px)",
        duration: F(26),
        ease: "expo.out",
        overwrite: true,
      });
    }
    n++;
  };

  const tl = gsap.timeline({ repeat: -1 });
  tl.fromTo(
    dot,
    { x: SEED_X + 130, opacity: 0 },
    { x: K - 70, duration: F(26), ease: EASE_INOUT, immediateRender: false },
    F(8),
  );
  tl.to(dot, { opacity: 1, duration: F(13), ease: "sine.out", yoyo: true, repeat: 1 }, F(8));
  hit(tl, b, 34);
  tl.call(emit, undefined, F(34));
  tl.set({}, {}, F(40));
  // pré-remplit la file pour que la ligne soit pleine dès l'affichage
  for (let i = 0; i < SLOTS - 1; i++) emit();
  return { el, tl, poster: 0, stop: () => slots.forEach((s) => gsap.killTweensOf(s.el)) };
};

export const LANES = { aes: aesLane, rsa: rsaLane, sha: shaLane, dh: dhLane, prng: prngLane };
export type LaneId = keyof typeof LANES;
