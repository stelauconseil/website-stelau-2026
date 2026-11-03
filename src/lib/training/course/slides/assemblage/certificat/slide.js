// Certificat électronique, construit en 5 clics (data-s des éléments) : identité, clé publique,
// empreinte SHA-256, signature RSA de l'autorité de certification, certificat assemblé.
// Les fils sont tracés d'après la position réelle des éléments : une accolade réunit identité et
// clé publique vers SHA-256, l'empreinte descend vers RSA (clé privée de l'AC), la signature
// revient dans son champ ; aucun fil ne se croise.
// Valeurs réelles : bi-clé RSA-2048 (WebCrypto) générée au chargement, empreinte et signature
// calculées sur le texte affiché.
import { gsap } from "gsap";
import { sha256, toHex } from "../../../lib/hash.js";
import { scrambleTo } from "../../../lib/scramble.js";

const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const cut = (s, w, lines) =>
  Array.from({ length: lines }, (_, i) => s.slice(i * w, (i + 1) * w)).join("\n") + "…";

const SVGNS = "http://www.w3.org/2000/svg";

export default function (sec, { printing }) {
  const stage = sec.querySelector(".ct-stage");
  const svg = sec.querySelector(".ct-wires");
  const q = (s) => sec.querySelector(s);
  // Position d'un élément dans la scène (offsets : insensibles à la mise à l'échelle de reveal.js)
  const rel = (el) => {
    let x = 0,
      y = 0;
    const w = el.offsetWidth,
      h = el.offsetHeight;
    while (el && el !== stage) {
      x += el.offsetLeft;
      y += el.offsetTop;
      el = el.offsetParent;
    }
    return { x, y, w, h, r: x + w, b: y + h, cx: x + w / 2, cy: y + h / 2 };
  };
  const place = (el, x, y) => Object.assign(el.style, { left: x + "px", top: y + "px" });
  const wire = (d, s, cls, mark) => {
    const p = document.createElementNS(SVGNS, "path");
    p.setAttribute("d", d);
    p.setAttribute("class", "ct-w " + cls);
    p.dataset.s = s;
    if (mark) p.setAttribute("marker-end", `url(#ct-ah-${mark})`);
    svg.appendChild(p);
  };
  // Coude arrondi : segment horizontal puis vertical (ou l'inverse), rayon r
  const elbowHV = (x0, y0, x1, y1, r = 14) => {
    const sx = Math.sign(x1 - x0),
      sy = Math.sign(y1 - y0);
    return `M${x0} ${y0} H${x1 - sx * r} Q${x1} ${y0} ${x1} ${y0 + sy * r} V${y1}`;
  };
  let laidOut = false;
  const layout = () => {
    if (laidOut || !stage.offsetWidth) return;
    laidOut = true;
    const card = rel(q(".ct-card")),
      id = rel(q(".ct-id")),
      pk = rel(q(".ct-pk")),
      sg = rel(q(".ct-sig"));
    const shaEl = q(".ct-sha"),
      hashEl = q(".ct-hashbox"),
      rsaEl = q(".ct-rsa"),
      capEl = q(".ct-rsacap");
    const shaBox = q(".ct-sha .prim-box"),
      rsaBox = q(".ct-rsa .prim-box");
    // Accolade à droite du certificat, de l'identité à la clé publique
    const bx = card.r + 16,
      d = 16,
      y0 = id.y + 6,
      y1 = pk.b - 6,
      ym = (y0 + y1) / 2;
    wire(
      `M${bx} ${y0} q${d} 0 ${d} ${d} V${ym - d} q0 ${d} ${d} ${d} q${-d} 0 ${-d} ${d} V${y1 - d} q0 ${d} ${-d} ${d}`,
      3,
      "sha brace",
    );
    // Colonne centrale : SHA-256, empreinte, RSA de l'AC
    const cx = bx + 2 * d + 46 + hashEl.offsetWidth / 2;
    const sw = shaBox.offsetWidth,
      sh = shaBox.offsetHeight;
    place(shaEl, cx - sw / 2, ym - sh / 2);
    wire(`M${bx + 2 * d + 6} ${ym} H${cx - sw / 2 - 8}`, 3, "sha", "sha");
    const hTop = ym + sh / 2 + 34;
    place(hashEl, cx - hashEl.offsetWidth / 2, hTop);
    wire(`M${cx} ${ym + sh / 2 + 6} V${hTop - 6}`, 3, "sha", "sha");
    const rw = rsaBox.offsetWidth,
      rh = rsaBox.offsetHeight;
    const rTop = Math.max(sg.cy - rh / 2, hTop + hashEl.offsetHeight + 32);
    const ry = rTop + rh / 2;
    place(rsaEl, cx - rw / 2, rTop);
    wire(`M${cx} ${hTop + hashEl.offsetHeight + 6} V${rTop - 8}`, 4, "rsa", "rsa");
    // Signature : de RSA vers son champ dans le certificat
    if (ry > sg.y + 12 && ry < sg.b - 12)
      wire(`M${cx - rw / 2 - 8} ${ry} H${card.r + 8}`, 4, "rsa", "rsa");
    else
      wire(elbowHV(cx - rw / 2 - 8, ry, card.r + 40, sg.cy) + ` H${card.r + 8}`, 4, "rsa", "rsa");
    // L'autorité de certification, à droite, sur l'axe de RSA ; sa clé privée signe
    const ac = q(".ct-ac"),
      acIco = rel(q(".ct-ac .prim-ico"));
    ac.style.top = ac.offsetTop + (ry - acIco.cy) + "px";
    const acNow = rel(q(".ct-ac .prim-ico"));
    wire(`M${acNow.x - 10} ${ry} H${cx + rw / 2 + 52}`, 4, "rsa dash", "rsa");
    place(capEl, cx - rw / 2, rTop + rh + 30);
    // Vérification de l'identité en face à face : colonne de droite
    const own = rel(q(".ct-owner .prim-ico")),
      chk = rel(q(".ct-check .ct-meet"));
    wire(`M${own.cx} ${rel(q(".ct-owner")).b + 8} V${chk.y - 10}`, 4, "dash", "mut");
    wire(`M${own.cx} ${rel(q(".ct-check")).b + 8} V${acNow.y - 10}`, 4, "dash", "mut");
  };

  // Clic 2 : la clé publique du titulaire vole jusqu'à son champ du certificat
  const fly = () => {
    const from = q(".ct-owner .ct-kpub"), // la clé du titulaire (son conteneur apparaît au même clic)
      to = q(".ct-pk .ct-kpub");
    const a = rel(from),
      b = rel(to);
    const ghost = from.cloneNode(true);
    Object.assign(ghost.style, {
      position: "absolute",
      left: a.x + "px",
      top: a.y + "px",
      width: a.w + "px",
      height: a.h + "px",
      margin: 0,
      zIndex: 5,
      opacity: 1,
      transform: "none",
    });
    stage.appendChild(ghost);
    gsap.set(to, { opacity: 0 });
    gsap
      .timeline({ onComplete: () => ghost.remove() })
      .to(ghost, {
        x: b.x - a.x,
        y: b.y - a.y,
        width: b.w,
        height: b.h,
        duration: 0.9,
        ease: "power2.inOut",
      })
      .to(ghost, { rotation: -360, duration: 0.9, ease: "power2.inOut" }, 0)
      .set(to, { opacity: 1 });
  };
  const items = () => [...sec.querySelectorAll("[data-s]")];
  const steps = [...sec.querySelectorAll(".ct-steps li")];
  const card = sec.querySelector(".ct-card");
  const $ = (id) => sec.querySelector("#" + id);
  const ident = $("ct-ident").textContent.trim();

  // Bi-clés : titulaire (sa clé publique entre dans le certificat), autorité de certification (signe)
  const algo = {
    name: "RSASSA-PKCS1-v1_5",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
  };
  const ready = (async () => {
    const owner = await crypto.subtle.generateKey(algo, true, ["sign", "verify"]);
    const ca = await crypto.subtle.generateKey(algo, true, ["sign", "verify"]);
    const jwk = await crypto.subtle.exportKey("jwk", owner.publicKey);
    const tbs = new TextEncoder().encode(ident + "\n" + jwk.n);
    const sig = await crypto.subtle.sign(algo, ca.privateKey, tbs);
    return {
      pk: cut(jwk.n, 18, 3),
      hash: cut(toHex(sha256(tbs)), 10, 4).slice(0, -1),
      sig: cut(b64(sig), 18, 3),
    };
  })();
  const fill = (animate) =>
    void ready.then((v) => {
      const put = (id, txt, s) => {
        const el = $(id);
        if (el.dataset.v === txt) return;
        el.dataset.v = txt;
        if (animate && cur >= s) scrambleTo(el, txt, 700);
        else el.textContent = txt;
      };
      put("ct-pk", v.pk, 2);
      put("ct-hash", v.hash, 3);
      put("ct-sig", v.sig, 4);
    });

  let cur = 0;
  const show = (n, animate) => {
    layout();
    for (const el of items()) {
      const on = Number(el.dataset.s) <= n;
      const was = el.classList.contains("ct-in");
      el.classList.toggle("ct-in", on);
      if (el.tagName === "path") {
        const len = el.getTotalLength?.() || 400;
        if (on && !was && animate)
          gsap.fromTo(
            el,
            { strokeDasharray: len, strokeDashoffset: len, opacity: 1 },
            {
              strokeDashoffset: 0,
              duration: 0.7,
              ease: "power2.out",
              onComplete: () => gsap.set(el, { clearProps: "strokeDasharray,strokeDashoffset" }),
            },
          );
        else gsap.set(el, { opacity: on ? 1 : 0 });
      } else if (on && !was && animate)
        gsap.fromTo(
          el,
          { opacity: 0, y: 14, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.6)" },
        );
      else gsap.set(el, { opacity: on ? 1 : 0, y: 0, scale: 1 });
    }
    steps.forEach((li) =>
      li.classList.toggle("on", Number(li.dataset.on) <= Math.max(n, 0) || n >= 5),
    );
    card.classList.toggle("done", n >= 5);
    sec.classList.toggle("hashed", n >= 3);
    sec.classList.toggle("signed", n >= 4);
    if (animate && n === 2 && !printing) fly();
    if (animate && n === 5) {
      const c = sec.querySelector(".ct-cert");
      gsap.fromTo(
        c,
        { scale: 0.3, rotation: -20 },
        { scale: 1, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" },
      );
    }
  };

  return {
    enter() {},
    step(n) {
      const animate = n > cur;
      cur = n;
      show(n, animate);
      fill(animate);
    },
    final() {
      cur = 5;
      show(5, false);
      fill(false);
    },
    printing,
  };
}
