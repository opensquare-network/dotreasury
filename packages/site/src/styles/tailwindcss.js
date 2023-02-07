// tailwindcss-flavored atomic class utilities
// https://tailwindcss.com
// `inline-block` => `inline_block`

import { css } from "styled-components";

// utility functions
// ---

export function theme(key) {
  return (p) => p.theme[key];
}
export function px(n) {
  return `${n}px`;
}
export function bg_theme(key) {
  return css`
    background-color: ${theme(key)};
  `;
}
export function text_theme(key) {
  return css`
    color: ${theme(key)};
  `;
}
export function m(n) {
  return css`
    margin: ${px(n)};
  `;
}
export function m_t(n) {
  return css`
    margin-top: ${px(n)};
  `;
}
export function m_r(n) {
  return css`
    margin-right: ${px(n)};
  `;
}
export function m_b(n) {
  return css`
    margin-bottom: ${px(n)};
  `;
}
export function m_l(n) {
  return css`
    margin-left: ${px(n)};
  `;
}
export function m_x(n) {
  return css`
    ${m_l(n)};
    ${m_r(n)};
  `;
}
export function m_y(n) {
  return css`
    ${m_t(n)};
    ${m_b(n)};
  `;
}
export function p(n) {
  return css`
    padding: ${px(n)};
  `;
}
export function p_t(n) {
  return css`
    padding-top: ${px(n)};
  `;
}
export function p_r(n) {
  return css`
    padding-right: ${px(n)};
  `;
}
export function p_b(n) {
  return css`
    padding-bottom: ${px(n)};
  `;
}
export function p_l(n) {
  return css`
    padding-left: ${px(n)};
  `;
}
export function p_x(n) {
  return css`
    ${p_l(n)};
    ${p_r(n)};
  `;
}
export function p_y(n) {
  return css`
    ${p_t(n)};
    ${p_b(n)};
  `;
}
export function gap_x(n) {
  return css`
    column-gap: ${px(n)};
  `;
}
export function gap_y(n) {
  return css`
    row-gap: ${px(n)};
  `;
}
export function gap(n) {
  return css`
    gap: ${px(n)};
  `;
}
export function space_x(n) {
  return css`
    & > * + * {
      ${m_l(n)}
    }
  `;
}
export function space_y(n) {
  return css`
    & > * + * {
      ${m_t(n)}
    }
  `;
}
/**
 * @example hover(border_theme500)
 * @example hover(text_theme("theme100"))
 */
export function hover(atom) {
  return css`
    &:hover {
      ${atom}
    }
  `;
}
export function w(n) {
  return css`
    width: ${px(n)};
  `;
}
export function h(n) {
  return css`
    height: ${px(n)};
  `;
}

// atoms
// ---

// display
export const flex = css`
  display: flex;
`;
export const inline_flex = css`
  display: inline-flex;
`;
export const block = css`
  display: block;
`;
export const inline_block = css`
  display: inline-block;
`;
export const inline = css`
  display: inline;
`;

// flex
export const flex_col = css`
  flex-direction: column;
`;
export const flex_1 = css`
  flex: 1 1 0%;
`;
export const justify_center = css`
  justify-content: center;
`;
export const justify_between = css`
  justify-content: space-between;
`;
export const justify_start = css`
  justify-content: flex-start;
`;
export const justify_end = css`
  justify-content: flex-end;
`;
export const items_center = css`
  align-items: center;
`;
export const items_start = css`
  align-items: flex-start;
`;
export const items_end = css`
  align-items: flex-end;
`;
export const items_stretch = css`
  align-items: stretch;
`;
export const flex_wrap = css`
  flex-wrap: wrap;
`;
export const flex_nowrap = css`
  flex-wrap: nowrap;
`;

// sizing
// ---

export const w_full = css`
  width: 100%;
`;
export const w_screen = css`
  width: 100vw;
`;
export const min_w_full = css`
  min-width: 100%;
`;
export const max_w_full = css`
  max-width: 100%;
`;
export const h_full = css`
  height: 100%;
`;
export const min_h_full = css`
  min-height: 100%;
`;
export const max_h_full = css`
  max-height: 100%;
`;
export const h_screen = css`
  height: 100vh;
`;
export const min_h_screen = css`
  min-height: 100vh;
`;
export const max_h_screen = css`
  max-height: 100vh;
`;

// spacing
// ---
export const p_0 = p(0);
export const p_16 = p(16);
export const p_24 = p(24);
export const m_0 = m(0);
export const m_16 = m(16);
export const m_24 = m(24);
export const m_x_auto = css`
  margin-left: auto;
  margin-right: auto;
`;

// borders
// ---

// border width
export const border = make_border(1);

// border radius
export const rounded = make_rounded(2);
export const rounded_4 = make_rounded(4);
export const rounded_8 = make_rounded(8);
export const rounded_full = make_rounded(9999);

// border color
export const border_theme500 = css`
  border-color: ${theme("theme500")};
`;
export const border_theme100 = css`
  border-color: ${theme("theme100")};
`;

// border style
export const border_hidden = css`
  border-style: hidden;
`;

// layout
// ---

// overflow
export const overflow_auto = css`
  overflow: auto;
`;
export const overflow_hidden = css`
  overflow: hidden;
`;
export const overflow_scroll = css`
  overflow: scroll;
`;
export const overflow_x_scroll = css`
  overflow-x: scroll;
`;
export const overflow_y_scroll = css`
  overflow-y: scroll;
`;

// z index
export const z_0 = make_z(0);
export const z_10 = make_z(10);
export const z_20 = make_z(20);
export const z_30 = make_z(30);
export const z_40 = make_z(40);
export const z_50 = make_z(50);
export const z_9999 = make_z(9999);

// position
export const relative = css`
  position: relative;
`;
export const absolute = css`
  position: absolute;
`;
export const fixed = css`
  position: fixed;
`;

// top right bottom left
export const inset_0 = css`
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

// typography
// ---

// whitespace
export const whitespace_nowrap = css`
  white-space: nowrap;
`;

// text overflow
export const text_ellipsis = css`
  text-overflow: ellipsis;
`;
export const truncate = css`
  ${overflow_hidden};
  ${whitespace_nowrap};
  ${text_ellipsis};
`;

// text color
export const text_primary = text_theme("fontPrimary");
export const text_primary_inverse = text_theme("fontPrimaryInverse");
export const text_secondary = text_theme("fontSecondary");
export const text_tertiary = text_theme("fontTertiary");
export const text_quaternary = text_theme("fontQuaternary");

// interactivity
// ---

// cursor
export const cursor_pointer = css`
  cursor: pointer;
`;

// backgrounds
// ---

// background color
export const bg_fill_panel = bg_theme("fillPanel");
export const bg_theme500 = bg_theme("theme500");

// private
// ---

function make_border(n) {
  return css`
    border-width: ${px(n)};
    border-style: solid;
  `;
}
function make_rounded(n) {
  return css`
    border-radius: ${px(n)};
  `;
}
function make_z(n) {
  return css`
    z-index: ${n};
  `;
}
