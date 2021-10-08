import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
BScroll.use(Slide);

interface easing {
  style: string;
  fn: (t: number) => number;
}

export interface slideType {
  loop?: boolean;
  threshold?: number;
  speed?: number;
  easing?: easing;
  listenFlick?: boolean;
  autoplay?: boolean;
  interval?: number;
}

let defaultEase: easing = {
  style: "cubic-bezier(0.165, 0.84, 0.44, 1)",
  fn: function(t: number) {
    return 1 - --t * t * t * t;
  },
};

let defaultSlide = {
  loop: true,
  threshold: 0.1,
  speed: 400,
  easing: defaultEase,
  listenFlick: true,
  autoplay: true,
  interval: 3000,
};

export function getSlide(
  wrapperName: HTMLElement | string,
  scrollX: boolean = true,
  scrollY: boolean = false,
  autoplay: boolean = true,
  speed: number = 400,
  interval: number = 4000,
  slide: slideType | boolean = true
) {
  return new BScroll(wrapperName, {
    scrollX,
    scrollY,
    slide: { ...defaultSlide, autoplay, speed, interval },
    click: true,
    momentum: false,
    bounce: false,
    stopPropagation: true,
    probeType: 2,
  });
}
