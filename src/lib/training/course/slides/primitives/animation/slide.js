// Les 5 primitives en action (scène GSAP de lib/crypto-primitives) : montée à la première visite,
// jouée tant que la planche est affichée, en pause ailleurs ; image fixe pour l'impression.
import { mount } from "../../../lib/crypto-primitives/index.ts";

export default function (sec, { printing }) {
  const host = sec.querySelector(".cpa-host");
  let scene;
  const ensure = () => (scene ??= mount(host, { background: false, pauseOffscreen: false }));
  return {
    enter() {
      ensure().play();
    },
    restart() {
      ensure().seek(0);
      ensure().play();
    },
    leave() {
      scene?.pause();
    },
    final() {
      ensure().poster();
    },
    printing,
  };
}
