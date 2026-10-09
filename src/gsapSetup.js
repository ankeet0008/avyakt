import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';

export { gsap, useGSAP };

gsap.registerPlugin(useGSAP, MorphSVGPlugin, DrawSVGPlugin, CustomEase);
