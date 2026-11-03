// Thème — identique à la version Remotion (couleurs et géométrie de la planche .pptx).

export const STAGE_W = 1920;
export const LANE_W = 1792;
export const LANE_H = 188;
export const LANE_GAP = 12;
export const PAD_Y = 46;
export const CY = 100; // axe du rail dans une ligne

/** Durée d'une « image » de référence : les timings sont exprimés en images à 60 fps. */
export const F = (frames: number) => frames / 60;

// Couleurs d'interface : variables du thème du cours (clair / sombre), valeurs d'origine en repli.
export const ui = {
  bg: "var(--cp-bg, #F6F7F9)",
  dot: "var(--cp-dot, rgba(15, 23, 42, 0.07))",
  card: "var(--cp-card, #FFFFFF)",
  cardBorder: "var(--cp-card-border, #E7EAEE)",
  rail: "var(--cp-rail, #E3E6EB)",
  ink: "var(--cp-ink, #0F172A)",
  inkSoft: "var(--cp-ink-soft, #334155)",
  muted: "var(--cp-muted, #8A94A3)",
  faint: "var(--cp-faint, #C3C9D2)",
  hashBox: "var(--cp-hash-box, #F3F5F8)",
};

export const fonts = {
  badge: "'Helvetica Neue', Helvetica, Inter, Arial, sans-serif",
  sans: "var(--sans, Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif)",
  mono: "var(--mono, 'JetBrains Mono', 'SF Mono', Menlo, monospace)",
};

export type Primitive = {
  label: string;
  color: string;
  fontPt: number;
  icon: string;
  iconColor: string;
  /** boîte de l'icône relative au coin haut-gauche du badge, en pt : [x, y, w, h] */
  iconBox: [number, number, number, number];
  ink: string;
};

/** Badge d'origine : 63,98 × 28,67 pt, coins arrondis 16,67 %, liseré blanc 3 pt. */
export const BADGE_PT = { w: 63.976, h: 28.668, radius: 0.16667, stroke: 3 };
const KEY_BOX: [number, number, number, number] = [45.79, 20.09, 29.745, 29.745];

export const primitives = {
  aes: {
    label: "AES",
    color: "#000000",
    fontPt: 20,
    icon: "key",
    iconColor: "#7F7F7F",
    iconBox: KEY_BOX,
    ink: "var(--cp-ink, #111827)",
  },
  rsaPub: {
    label: "RSA",
    color: "#B22600",
    fontPt: 20,
    icon: "key",
    iconColor: "#92D050",
    iconBox: KEY_BOX,
    ink: "#B22600",
  },
  rsaPriv: {
    label: "RSA",
    color: "#B22600",
    fontPt: 20,
    icon: "key",
    iconColor: "#C00000",
    iconBox: KEY_BOX,
    ink: "#B22600",
  },
  sha: {
    label: "SHA",
    color: "#0070C0",
    fontPt: 20,
    icon: "fingerprint",
    iconColor: "#0070C0",
    iconBox: [56.379, 22.207, 27.656, 27.656],
    ink: "#0070C0",
  },
  dh: {
    label: "DH",
    color: "#7030A0",
    fontPt: 20,
    icon: "shuffle",
    iconColor: "#7030A0",
    iconBox: [54.659, 23.526, 30.835, 20.977],
    ink: "#7030A0",
  },
  prng: {
    label: "PRNG",
    color: "#FF9900",
    fontPt: 16,
    icon: "binary-circle-check",
    iconColor: "#FF9900",
    iconBox: [60.199, 22.153, 34.321, 27.457],
    ink: "#C26F00",
  },
} satisfies Record<string, Primitive>;

export const people = {
  alice: { icon: "user-tie-hair-long", color: "#941100" },
  bob: { icon: "user-tie-hair", color: "#FF9900" },
};

export const SECONDARY_OPACITY = 0.4;

export const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789@#$%&*+=?";
export const HEX = "0123456789abcdef";

// GSAP : équivalents des courbes de la version Remotion
export const EASE_INOUT = "power3.inOut"; // ≈ bezier(.65,0,.35,1)
export const EASE_OUT = "expo.out"; // ≈ bezier(.16,1,.3,1)
export const EASE_IN = "power3.in";
