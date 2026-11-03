// Effet « calcul en cours » : le texte défile en hexadécimal aléatoire puis se fige sur la valeur.
const HEX = "0123456789abcdef";

/**
 * Affiche `value` dans `el` après un défilement de `ms` millisecondes (aucun défilement si ms = 0).
 * Renvoie une fonction d'annulation. Les caractères se figent de gauche à droite.
 */
export function scrambleTo(el, value, ms = 650) {
  if (!ms) {
    el.textContent = value;
    return () => {};
  }
  const t0 = performance.now();
  let raf = 0;
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / ms);
    const fixed = Math.floor(p * value.length);
    let s = value.slice(0, fixed);
    for (let i = fixed; i < value.length; i++)
      s += /[0-9a-f]/.test(value[i]) ? HEX[(Math.random() * 16) | 0] : value[i];
    el.textContent = s;
    if (p < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
