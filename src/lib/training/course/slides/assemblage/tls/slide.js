// TLS : chaque clic éclaire un segment de la suite, sa primitive, ses colonnes du tableau et ses
// échanges dans la poignée de main. Impression : tout éclairé.
import { gsap } from "gsap";

const ORDER = ["", "dh", "rsa", "aes", "sha"];

export default function (sec) {
  let cur = 0;
  const set = (n, animate) => {
    sec.dataset.hl = ORDER[n] || "";
    sec.querySelectorAll('[data-tls-role]').forEach(role => {
      role.dataset.active = String(role.dataset.k === ORDER[n]);
    });
    if (animate && ORDER[n]) {
      const seg = sec.querySelector(`.tl-seg[data-k="${ORDER[n]}"]`);
      const p = sec.querySelector(`.tl-p[data-k="${ORDER[n]}"]`);
      gsap.fromTo(
        seg,
        { scale: 1 },
        { scale: 1.12, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
      );
      gsap.fromTo(p, { y: -10 }, { y: 0, duration: 0.5, ease: "back.out(2)" });
    }
  };
  return {
    step(n) {
      set(n, n > cur);
      cur = n;
    },
    final() {
      sec.dataset.hl = "dh rsa aes sha";
      sec.querySelectorAll('[data-tls-role]').forEach(role => {role.dataset.active = 'true';});
    },
  };
}
