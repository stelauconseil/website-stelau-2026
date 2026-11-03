import { registerScramble } from "./scramble";
import { h } from "./dom";
import { LANES, type LaneBuild, type LaneId } from "./lanes";
import { injectStyles } from "./styles";
import { LANE_GAP, LANE_H, PAD_Y, STAGE_W } from "./theme";

registerScramble();

export type MountOptions = {
  /** Lignes à afficher, dans l'ordre. Par défaut : les 5. */
  lanes?: LaneId[];
  /** Fond clair pointillé (true) ou transparent (false). */
  background?: boolean;
  /** Mettre en pause quand l'animation sort de l'écran (défaut : true). */
  pauseOffscreen?: boolean;
};

export type Handle = {
  play(): void;
  pause(): void;
  /** Positionne toutes les lignes à t secondes (hors PRNG) et met en pause. */
  seek(t: number): void;
  /** Image fixe représentative (impression, aperçu) : chaque ligne à son instant « affiche ». */
  poster(): void;
  destroy(): void;
};

export const ALL_LANES: LaneId[] = ["aes", "rsa", "sha", "dh", "prng"];

export function mount(host: HTMLElement, opts: MountOptions = {}): Handle {
  injectStyles();
  const ids = (opts.lanes?.length ? opts.lanes : ALL_LANES).filter((id) => id in LANES);
  const stageH = PAD_Y * 2 + ids.length * LANE_H + (ids.length - 1) * LANE_GAP;

  const root = h("div", `cp-root${opts.background === false ? "" : " cp-bg"}`, {
    aspectRatio: `${STAGE_W} / ${stageH}`,
  });
  root.setAttribute("role", "img");
  root.setAttribute(
    "aria-label",
    "Animation des primitives cryptographiques : AES, RSA, SHA, Diffie-Hellman, PRNG",
  );
  const stage = h("div", "cp-stage", { height: `${stageH}px` });
  root.appendChild(stage);
  host.replaceChildren(root);

  const built: LaneBuild[] = ids.map((id, i) => {
    const l = LANES[id]();
    l.el.style.top = `${PAD_Y + i * (LANE_H + LANE_GAP)}px`;
    stage.appendChild(l.el);
    return l;
  });

  // mise à l'échelle : la scène est dessinée en 1920 px de large
  const fit = () => {
    stage.style.transform = `scale(${root.clientWidth / STAGE_W})`;
  };
  fit();
  const ro = new ResizeObserver(fit);
  ro.observe(root);

  const reduced =
    typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let wanted = !reduced;
  let visible = true;
  const sync = () => built.forEach((l) => (wanted && visible ? l.tl.play() : l.tl.pause()));

  if (reduced) built.forEach((l) => l.tl.pause(l.poster));

  let io: IntersectionObserver | undefined;
  if (opts.pauseOffscreen !== false && typeof IntersectionObserver !== "undefined") {
    io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(root);
  }

  return {
    play() {
      wanted = true;
      sync();
    },
    pause() {
      wanted = false;
      sync();
    },
    poster() {
      wanted = false;
      built.forEach((l) => l.tl.pause(l.poster));
    },
    seek(t: number) {
      wanted = false;
      built.forEach((l) => l.tl.pause(t % l.tl.duration()));
    },
    destroy() {
      io?.disconnect();
      ro.disconnect();
      built.forEach((l) => {
        l.tl.kill();
        l.stop?.();
      });
      root.remove();
    },
  };
}
