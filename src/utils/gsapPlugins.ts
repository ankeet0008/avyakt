import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

let registered = false;

export function registerGSAP() {
  if (typeof window !== 'undefined' && !registered) {
    gsap.registerPlugin(MorphSVGPlugin, DrawSVGPlugin);
    registered = true;
  }
  return { gsap, MorphSVGPlugin, DrawSVGPlugin };
}

export { gsap, MorphSVGPlugin, DrawSVGPlugin };
