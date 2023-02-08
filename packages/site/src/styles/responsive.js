// https://tailwindcss.com/docs/responsive-design
// but use `max-width`, means less than xxx

import { MOBILE_SIZE } from "@osn/constants";

export const SM_SIZE = 768;
export const MD_SIZE = 1024;
export const LG_SIZE = 1280;

/**
 * @param {import("styled-components").ThemedCssFunction} css
 * @description less than 900, origin way
 */
export const mobilecss = (css) => breakpoint(MOBILE_SIZE, css);

/**
 * @param {import("styled-components").ThemedCssFunction} css
 * @description less than 768
 */
export const smcss = (css) => breakpoint(SM_SIZE, css);

/**
 * @param {import("styled-components").ThemedCssFunction} css
 * @description less than 1024
 */
export const mdcss = (css) => breakpoint(MD_SIZE, css);

/**
 * @param {import("styled-components").ThemedCssFunction} css
 * @description less than 1280
 */
export const lgcss = (css) => breakpoint(LG_SIZE, css);

/**
 * @param {number} size
 * @param {string} css
 * @description less than `size`
 */
export function breakpoint(size, css) {
  return `@media (max-width: ${size}px) {
    ${css}
  }`;
}
