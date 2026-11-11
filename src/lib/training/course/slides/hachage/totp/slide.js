// TOTP en direct : SHA-1 du secret, puis du secret et de l'heure (comme la planche d'origine),
// et le vrai calcul RFC 6238 : HMAC-SHA1(K, ⌊t/30⌋), troncature dynamique, modulo 10⁶.
import { base32, sha1, toHex, totp } from "../../../lib/hash.js";
import { gsap } from "gsap";
import { scrambleTo } from "../../../lib/scramble.js";

const pad = (n) => String(n).padStart(2, "0");
// Date et heure à la seconde : l'empreinte de la 2ᵉ ligne change donc chaque seconde.
const stamp = (d) =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(2)}-${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
// Empreinte au format de la planche : les premiers caractères en gras, la suite estompée.
const split = (el, hex, n) => {
  el.innerHTML = `<b>${hex.slice(0, n)}</b><span class="dim">${hex.slice(n)}</span>`;
};

export default function (sec) {
  const $ = (id) => sec.querySelector("#" + id);
  const K = sec.querySelector(".to-sec").textContent.trim();
  const h1 = $("to-h1"),
    h2 = $("to-h2");
  const t1 = document.createElement("span"),
    t2 = document.createElement("span");
  // « … » provisoire retiré ; l'empreinte se place devant le badge SHA1.
  for (const [h, t] of [
    [h1, t1],
    [h2, t2],
  ]) {
    Array.from(h.childNodes)
      .filter((n) => n.nodeType === 3)
      .forEach((n) => n.remove());
    h.prepend(t);
  }
  t1.textContent = toHex(sha1(K)); // 1re ligne : toujours la même empreinte, sans mise en avant
  $("to-b32").textContent = base32(K)
    .replace(/(.{4})/g, "$1 ")
    .trim();

  const cells = Array.from({ length: 20 }, () =>
    $("to-mac").appendChild(document.createElement("span")),
  );
  let timer = 0,
    lastS = "",
    lastT = -1,
    firstDone = false;
  // SMS : à chaque nouveau code, une nouvelle bulle monte lentement du bas ; l'ancienne monte
  // devant elle et s'efface, coupée par le cadre (overflow) avant d'atteindre la ligne 2.
  const box = sec.querySelector(".to-sms");
  let bubble = box.querySelector(".to-bubble");
  gsap.set(bubble, { yPercent: -50 });
  const sms = (code, animate) => {
    if (!animate) {
      gsap.killTweensOf(box.querySelectorAll(".to-bubble"));
      box.querySelectorAll(".to-bubble").forEach((b) => b !== bubble && b.remove());
      gsap.set(bubble, { y: 0, autoAlpha: 1 });
      bubble.querySelector(".to-smscode").textContent = code;
      return;
    }
    const old = bubble;
    bubble = old.cloneNode(true);
    bubble.querySelector(".to-smscode").textContent = code;
    box.appendChild(bubble);
    const H = box.clientHeight;
    gsap.fromTo(
      bubble,
      { yPercent: -50, y: H, autoAlpha: 1 },
      { y: 0, duration: 1.8, ease: "power2.out" },
    );
    gsap.to(old, {
      y: -H,
      autoAlpha: 0,
      duration: 1.8,
      ease: "power2.out",
      onComplete: () => old.remove(),
    });
  };

  const tick = (animate = true) => {
    const now = new Date();
    const s = stamp(now);
    if (s !== lastS) {
      lastS = s;
      // Les secondes, des deux côtés, « battent » à chaque changement
      sec.querySelectorAll(".to-now").forEach((e) => {
        e.innerHTML = ` ${s.slice(0, -2)}<span class="to-ss">${s.slice(-2)}</span>`;
        if (animate) e.querySelector(".to-ss").classList.add("tick");
      });
      const hex = toHex(sha1(`${K} ${s}`));
      if (animate) {
        scrambleTo(t2, hex, 380);
        setTimeout(() => split(t2, hex, 6), 420);
      } else split(t2, hex, 6);
    }
    const o = totp(K, now.getTime() / 1000);
    $("to-sec").textContent = Math.ceil(o.remaining);
    $("to-ring").style.strokeDashoffset = 30 - o.remaining;
    sec.classList.toggle("to-hurry", o.remaining < 6);
    if (o.T !== lastT) {
      lastT = o.T;
      $("to-T").textContent = o.T;
      o.mac.forEach((b, i) => {
        cells[i].textContent = b.toString(16).padStart(2, "0");
        cells[i].className = i === 19 ? "last" : i >= o.offset && i < o.offset + 4 ? "pick" : "";
      });
      cells[19].dataset.off = `offset = ${o.offset}`;
      $("to-bin").textContent = o.bin.toLocaleString("fr-FR");
      const code = `${o.code.slice(0, 3)} ${o.code.slice(3)}`;
      for (const id of ["to-otp", "to-otp2"]) scrambleTo($(id), code, animate ? 500 : 0);
      sms(o.code, animate && lastT !== -1 && firstDone); // le SMS porte le même code, sans espace
      firstDone = true;
    }
  };

  return {
    enter() {
      tick(false);
      clearInterval(timer);
      timer = setInterval(tick, 250);
    },
    leave() {
      clearInterval(timer);
    },
    final() {
      tick(false);
    },
  };
}
