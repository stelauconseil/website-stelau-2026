// TOTP en direct : SHA-1 du secret, puis du secret et de l'heure (comme la planche d'origine),
// et le vrai calcul RFC 6238 : HMAC-SHA1(K, ⌊t/30⌋), troncature dynamique, modulo 10⁶.
import { base32, sha1, toHex, totp } from "../../../lib/hash.js";
import { scrambleTo } from "../../../lib/scramble.js";

const pad = (n) => String(n).padStart(2, "0");
const stamp = (d) =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(2)}-${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
  split(t1, toHex(sha1(K)), 4);
  $("to-b32").textContent = base32(K)
    .replace(/(.{4})/g, "$1 ")
    .trim();

  const cells = Array.from({ length: 20 }, () =>
    $("to-mac").appendChild(document.createElement("span")),
  );
  let timer = 0,
    lastMin = "",
    lastT = -1;

  const tick = (animate = true) => {
    const now = new Date();
    const s = stamp(now);
    if (s !== lastMin) {
      lastMin = s;
      sec.querySelectorAll(".to-now").forEach((e) => (e.textContent = ` ${s}`));
      const hex = toHex(sha1(`${K} ${s}`));
      if (animate) {
        scrambleTo(t2, hex, 600);
        setTimeout(() => split(t2, hex, 6), 650);
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
