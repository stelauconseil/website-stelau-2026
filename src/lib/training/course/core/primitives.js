// Repères visuels du cours : badges des 5 primitives et icônes Font Awesome Duotone.
//
//   <span class="prim" data-prim="aes"></span>              badge complet (64 px de haut par défaut)
//                                     aes, rsa (bi-clé), rsa-pub, rsa-priv, sha, dh, prng, auth, cert
//   <span class="prim" data-prim="sha" data-h="40"></span>  badge de 40 px de haut
//   <span class="prim" data-prim="sha" data-label="SHA256" data-h="22"></span>  libellé précisé
//   <span class="prim-ico" data-prim="dh"></span>           icône seule de la primitive, à la taille du texte
//   <i class="duo" data-icon="user-tie-hair"></i>           n'importe quelle icône de media/icons/…/duotone-solid
//
// Couleurs et géométrie : celles de la planche PowerPoint d'origine, reprises au point près
// dans « Stack animations vidéo » (Remotion puis GSAP). Icônes : SVG officiels Font Awesome 7.3.1.

const RAW = import.meta.glob("../media/icons/fontawesome/duotone-solid/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});
const fileOf = (name) => RAW[`../media/icons/fontawesome/duotone-solid/${name}.svg`];

/**
 * Icônes composées de SVG officiels (aucun tracé retouché) : chaque partie est une icône posée
 * dans une boîte [x, y, l, h] d'un carré de 512, avec au besoin l'opacité de son calque secondaire.
 * « seal-check-key » : le sceau de vérification d'AUTH, la coche et, dessous, une petite clé
 * publique couchée : on ne vérifie pas une signature sans clé publique.
 */
export const COMPOSITES = {
  "seal-check-key": [
    { icon: "badge" },
    { icon: "check", box: [156, 92, 200, 200], secondary: 1 },
    { icon: "key", box: [196, 286, 120, 120], secondary: 1, rotate: -135 },
  ],
};
/** Fichiers SVG dont dépend une icône (elle-même, ou les parties d'une icône composée). */
export const filesOf = (name) => (COMPOSITES[name] ? COMPOSITES[name].map((p) => p.icon) : [name]);
const svgOf = (name) => {
  const parts = COMPOSITES[name];
  if (!parts) return fileOf(name);
  const inner = parts
    .map(({ icon, box = [0, 0, 512, 512], secondary, rotate }) => {
      let s = (fileOf(icon) || "").replace(/<!--[\s\S]*?-->/g, "");
      if (secondary !== undefined) s = s.replace(/opacity="\.4"/g, `opacity="${secondary}"`);
      const [x, y, w, h] = box;
      if (rotate) {
        const [, , vw, vh] = s
          .match(/viewBox="([^"]+)"/)[1]
          .split(/\s+/)
          .map(Number);
        s = s
          .replace(/(<svg[^>]*>)/, `$1<g transform="rotate(${rotate} ${vw / 2} ${vh / 2})">`)
          .replace("</svg>", "</g></svg>");
      }
      return s.replace(
        /<svg[^>]*?(viewBox="[^"]+")[^>]*>/,
        `<svg x="${x}" y="${y}" width="${w}" height="${h}" overflow="visible" $1>`,
      );
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${inner}</svg>`;
};

/** Badge d'origine : 63,98 × 28,67 pt, coins arrondis 16,67 %, liseré blanc 3 pt. */
export const BADGE_PT = { w: 63.976, h: 28.668, radius: 0.16667, stroke: 3 };
const KEY_BOX = [45.79, 20.09, 29.745, 29.745];

/**
 * Un repère : groupe (« primitive » : les 5 primitives ; « variante » : clé publique / privée seule ;
 * « assemblage » : AUTH, CERT), libellé, famille (libellé de la planche « Les 5 primitives »), fond
 * du badge, corps du libellé (pt), icône et sa couleur,
 * boîte de l'icône relative au coin haut-gauche du badge (pt : x, y, l, h), couleur des données.
 */
export const PRIMITIVES = {
  aes: {
    groupe: "primitive",
    label: "AES",
    famille: "Chiffrement symétrique",
    color: "#000000",
    fontPt: 20,
    icon: "key",
    iconColor: "#7F7F7F",
    box: KEY_BOX,
    ink: "#111827",
  },
  // RSA, le bi-clé : clé privée rouge derrière, clé publique verte devant (planche « Les 5 primitives »).
  rsa: {
    groupe: "primitive",
    label: "RSA",
    famille: "Chiffrement asymétrique",
    color: "#B22600",
    fontPt: 20,
    icons: [
      { icon: "key", color: "#C00000", box: [46.11, 20.25, 29.745, 29.745] },
      { icon: "key", color: "#92D050", box: [67.9, 21.67, 29.745, 29.745] },
    ],
    ink: "#B22600",
  },
  "rsa-pub": {
    groupe: "variante",
    label: "RSA",
    famille: "Chiffrement asymétrique · clé publique",
    color: "#B22600",
    fontPt: 20,
    icon: "key",
    iconColor: "#92D050",
    box: KEY_BOX,
    ink: "#B22600",
  },
  "rsa-priv": {
    groupe: "variante",
    label: "RSA",
    famille: "Chiffrement asymétrique · clé privée",
    color: "#B22600",
    fontPt: 20,
    icon: "key",
    iconColor: "#C00000",
    box: KEY_BOX,
    ink: "#B22600",
  },
  sha: {
    groupe: "primitive",
    label: "SHA",
    famille: "Fonctions de hachage",
    color: "#0070C0",
    fontPt: 20,
    icon: "fingerprint",
    iconColor: "#0070C0",
    box: [56.379, 22.207, 27.656, 27.656],
    ink: "#0070C0",
  },
  dh: {
    groupe: "primitive",
    label: "DH",
    famille: "Établissement de clé",
    color: "#7030A0",
    fontPt: 20,
    icon: "shuffle",
    iconColor: "#7030A0",
    box: [54.659, 23.526, 30.835, 20.977],
    ink: "#7030A0",
  },
  prng: {
    groupe: "primitive",
    label: "PRNG",
    famille: "Générateurs d'aléa",
    color: "#FF9900",
    fontPt: 16,
    icon: "binary-circle-check",
    iconColor: "#FF9900",
    box: [60.199, 22.153, 34.321, 27.457],
    ink: "#C26F00",
  },
  // AUTH, l'authentification par signature : c'est toujours le bi-clé RSA (clé privée rouge pour
  // signer), mais tourné vers la preuve : le sceau vert de vérification contient la clé publique.
  // Mauve propre au badge, distinct des 5 primitives et du vert des certificats (#00B050 du pptx).
  auth: {
    groupe: "assemblage",
    label: "AUTH",
    famille: "Authentification par signature",
    color: "#A3195B",
    fontPt: 16,
    icons: [
      { icon: "key", color: "#C00000", box: [46.11, 20.25, 29.745, 29.745] },
      { icon: "seal-check-key", color: "#92D050", box: [67.9, 21.67, 29.745, 29.745] },
    ],
    ink: "#A3195B",
  }, // CERT, le certificat : vert du pptx (#00B050), icône « file-certificate ». Un assemblage
  // cryptographique (clé publique + identité, signés par une autorité), comme AUTH.
  cert: {
    groupe: "assemblage",
    label: "CERT",
    famille: "Certificat",
    color: "#00B050",
    fontPt: 16,
    icon: "file-certificate",
    iconColor: "#00B050",
    box: [57.87, 16.24, 27.33, 27.33],
    ink: "#00B050",
  },
};
export const PEOPLE = {
  alice: { icon: "user-tie-hair-long", color: "#941100" },
  bob: { icon: "user-tie-hair", color: "#FF9900" },
};

/**
 * Ajustements des icônes : cadrage serré (pour remplir la boîte d'origine) et retouches.
 * DH : « shuffle » dont la flèche secondaire est retournée (rotation de 180°), comme sur la planche.
 */
const FIT = {
  key: { box: [0, 0, 512, 512] },
  "seal-check-key": { box: [0, 0, 512, 512] },
  "file-certificate": { box: [0, 0, 512, 512] },
  fingerprint: { box: [0, 0, 512, 504] },
  shuffle: { box: [0, 96, 512, 384], secondaryRotate: true },
  "binary-circle-check": { box: [64, 0, 512, 544] },
  "user-tie-hair": { box: [16, 0, 416, 512] },
  "user-tie-hair-long": { box: [16, 0, 416, 512] },
};

const r2 = (v) => Math.round(v * 100) / 100;

/** SVG duotone prêt à insérer : calques en currentColor (secondaire à 40 %), cadrage serré si connu. */
export function duoSvg(name, { tight = false } = {}) {
  let s = svgOf(name);
  if (!s) {
    console.warn("Icône Font Awesome introuvable :", name);
    return "";
  }
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  const fit = FIT[name];
  const [, , vw, vh] = s
    .match(/viewBox="([^"]+)"/)[1]
    .split(/\s+/)
    .map(Number);
  if (fit?.secondaryRotate)
    s = s.replace(
      /<path opacity="\.4"/g,
      `<path opacity=".4" transform="rotate(180 ${vw / 2} ${vh / 2})"`,
    );
  if (tight && fit) s = s.replace(/viewBox="[^"]+"/, `viewBox="${fit.box.join(" ")}"`);
  return s.replace(
    "<svg ",
    '<svg aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet" overflow="visible" ',
  );
}

/** Badge complet d'une primitive, hauteur `h` en px. */
/** Calques d'icônes d'une primitive : une icône, ou plusieurs (bi-clé RSA). */
const layersOf = (p) => p.icons || [{ icon: p.icon, color: p.iconColor || p.color, box: p.box }];

export function badgeHTML(key, h = 64, label) {
  const p = PRIMITIVES[key];
  if (!p) return `<span class="prim-err">primitive inconnue : ${key}</span>`;
  // Libellé précisé (SHA1, SHA256…) : même badge, corps réduit pour tenir dans la largeur d'origine.
  const text = label || p.label;
  const fontPt = label ? Math.min(p.fontPt, 64 / Math.max(3, text.length)) : p.fontPt;
  const k = h / BADGE_PT.h;
  const w = BADGE_PT.w * k,
    r = BADGE_PT.radius * BADGE_PT.h * k,
    sw = BADGE_PT.stroke * k;
  const layers = layersOf(p).map((l) => ({ ...l, b: l.box.map((v) => v * k) }));
  // Les icônes débordent du badge en bas à droite : la boîte englobante réserve leur place.
  const W = Math.max(w, ...layers.map(({ b }) => b[0] + b[2])),
    H = Math.max(h, ...layers.map(({ b }) => b[1] + b[3]));
  const icons = layers
    .map(
      ({ icon, color, b: [ix, iy, iw, ih] }) =>
        `<span class="prim-i" style="left:${r2(ix)}px;top:${r2(iy)}px;width:${r2(iw)}px;height:${r2(ih)}px;color:${color}">${duoSvg(icon, { tight: true })}</span>`,
    )
    .join("");
  return (
    `<span class="prim-b" style="width:${r2(W)}px;height:${r2(H)}px">` +
    `<span class="prim-box" style="width:${r2(w)}px;height:${r2(h)}px">` +
    icons +
    `<span class="prim-f" style="inset:${r2(-sw / 2)}px;border-width:${r2(sw)}px;` +
    `border-radius:${r2(r + sw / 2)}px;background:${p.color};` +
    `box-shadow:0 ${r2(1.575 * k)}px ${r2(3.15 * k)}px rgba(0,0,0,.38);font-size:${r2(fontPt * k)}px">${text}</span>` +
    `</span></span>`
  );
}

/** Remplit les repères (.prim, .prim-ico, .duo) contenus dans `root`. */
export function hydrate(root = document) {
  root.querySelectorAll(".prim[data-prim]").forEach((el) => {
    el.innerHTML = badgeHTML(el.dataset.prim, Number(el.dataset.h) || 64, el.dataset.label);
    el.setAttribute("role", "img");
    const p = PRIMITIVES[el.dataset.prim];
    el.setAttribute(
      "aria-label",
      p ? `${el.dataset.label || p.label} · ${p.famille}` : el.dataset.prim,
    );
  });
  root.querySelectorAll(".prim-ico[data-prim]").forEach((el) => {
    const p = PRIMITIVES[el.dataset.prim] || PEOPLE[el.dataset.prim];
    if (!p) return;
    const layers = layersOf(p);
    if (layers.length === 1) {
      el.style.color = layers[0].color;
      el.innerHTML = duoSvg(layers[0].icon, { tight: true });
      return;
    }
    // Plusieurs icônes (bi-clé) : même disposition relative que sur le badge, ramenée à la hauteur du texte.
    const x0 = Math.min(...layers.map((l) => l.box[0])),
      y0 = Math.min(...layers.map((l) => l.box[1])),
      x1 = Math.max(...layers.map((l) => l.box[0] + l.box[2])),
      y1 = Math.max(...layers.map((l) => l.box[1] + l.box[3]));
    const pc = (v, d) => r2((100 * v) / d) + "%";
    el.classList.add("multi");
    el.style.width = r2((1.15 * (x1 - x0)) / (y1 - y0)) + "em";
    el.innerHTML = layers
      .map(
        (l) =>
          `<span style="left:${pc(l.box[0] - x0, x1 - x0)};top:${pc(l.box[1] - y0, y1 - y0)};width:${pc(l.box[2], x1 - x0)};height:${pc(l.box[3], y1 - y0)};color:${l.color}">${duoSvg(l.icon, { tight: true })}</span>`,
      )
      .join("");
  });
  root.querySelectorAll(".duo[data-icon]").forEach((el) => {
    el.innerHTML = duoSvg(el.dataset.icon, { tight: el.hasAttribute("data-tight") });
  });
}
