// tailwindcss-flavored atomic class utilities
// https://tailwindcss.com
// `inline-block` => `inline_block`

// utility functions
// ---

export function theme(key) {
  return (p) => p.theme[key];
}
export function px(n) {
  return `${n}px`;
}
export function bg_theme(key) {
  return `
    background-color: ${theme(key)};
  `;
}
export function text_theme(key) {
  return `
    color: ${theme(key)};
  `;
}
export function m(n) {
  return `
    margin: ${px(n)};
  `;
}
export function m_t(n) {
  return `
    margin-top: ${px(n)};
  `;
}
export function m_r(n) {
  return `
    margin-right: ${px(n)};
  `;
}
export function m_b(n) {
  return `
    margin-bottom: ${px(n)};
  `;
}
export function m_l(n) {
  return `
    margin-left: ${px(n)};
  `;
}
export function m_x(n) {
  return `
    ${m_l(n)};
    ${m_r(n)};
  `;
}
export function m_y(n) {
  return `
    ${m_t(n)};
    ${m_b(n)};
  `;
}
export function p(n) {
  return `
    padding: ${px(n)};
  `;
}
export function p_t(n) {
  return `
    padding-top: ${px(n)};
  `;
}
export function p_r(n) {
  return `
    padding-right: ${px(n)};
  `;
}
export function p_b(n) {
  return `
    padding-bottom: ${px(n)};
  `;
}
export function p_l(n) {
  return `
    padding-left: ${px(n)};
  `;
}
export function p_x(n) {
  return `
    ${p_l(n)};
    ${p_r(n)};
  `;
}
export function p_y(n) {
  return `
    ${p_t(n)};
    ${p_b(n)};
  `;
}
export function gap_x(n) {
  return `
    column-gap: ${px(n)};
  `;
}
export function gap_y(n) {
  return `
    row-gap: ${px(n)};
  `;
}
export function gap(n) {
  return `
    gap: ${px(n)};
  `;
}
export function space_x(n) {
  return `
    & > * + * {
      ${m_l(n)}
    }
  `;
}
export function space_y(n) {
  return `
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
  return `
    &:hover {
      ${atom}
    }
  `;
}
export function w(n) {
  return `
    width: ${px(n)};
  `;
}
export function h(n) {
  return `
    height: ${px(n)};
  `;
}
export function grid_cols(repeat, min = 0) {
  return `
    grid-template-columns: repeat(${repeat}, minmax(${min}px, 1fr));
  `;
}

// atoms
// ---

// display
export const flex = `
  display: flex;
`;
export const inline_flex = `
  display: inline-flex;
`;
export const block = `
  display: block;
`;
export const inline_block = `
  display: inline-block;
`;
export const inline = `
  display: inline;
`;
export const grid = `
  display: grid;
`;
export const hidden = `
  display: none;
`;

// flex
export const flex_col = `
  flex-direction: column;
`;
export const flex_col_reverse = `
  flex-direction: column-reverse;
`;
export const flex_row = `
  flex-direction: row;
`;
export const flex_row_reverse = `
  flex-direction: row-reverse;
`;
export const flex_1 = `
  flex: 1 1 0%;
`;
export const justify_center = `
  justify-content: center;
`;
export const justify_between = `
  justify-content: space-between;
`;
export const justify_start = `
  justify-content: flex-start;
`;
export const justify_end = `
  justify-content: flex-end;
`;
export const items_baseline = `
  align-items: baseline;
`;
export const items_center = `
  align-items: center;
`;
export const items_start = `
  align-items: flex-start;
`;
export const items_end = `
  align-items: flex-end;
`;
export const items_stretch = `
  align-items: stretch;
`;
export const flex_wrap = `
  flex-wrap: wrap;
`;
export const flex_nowrap = `
  flex-wrap: nowrap;
`;

// sizing
// ---

export const w_full = `
  width: 100%;
`;
export const w_screen = `
  width: 100vw;
`;
export const min_w_full = `
  min-width: 100%;
`;
export const max_w_full = `
  max-width: 100%;
`;
export const h_full = `
  height: 100%;
`;
export const min_h_full = `
  min-height: 100%;
`;
export const max_h_full = `
  max-height: 100%;
`;
export const h_screen = `
  height: 100vh;
`;
export const min_h_screen = `
  min-height: 100vh;
`;
export const max_h_screen = `
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
export const m_x_auto = `
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
export const rounded_none = make_rounded(0);

// border color
export const border_theme500 = `
  border-color: ${theme("theme500")};
`;
export const border_theme100 = `
  border-color: ${theme("theme100")};
`;

// border style
export const border_hidden = `
  border-style: hidden;
`;

// layout
// ---

// overflow
export const overflow_auto = `
  overflow: auto;
`;
export const overflow_hidden = `
  overflow: hidden;
`;
export const overflow_scroll = `
  overflow: scroll;
`;
export const overflow_x_scroll = `
  overflow-x: scroll;
`;
export const overflow_y_scroll = `
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
export const relative = `
  position: relative;
`;
export const absolute = `
  position: absolute;
`;
export const fixed = `
  position: fixed;
`;

// top right bottom left
export const inset_0 = `
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

// typography
// ---

// whitespace
export const whitespace_nowrap = `
  white-space: nowrap;
`;

// text overflow
export const text_ellipsis = `
  text-overflow: ellipsis;
`;
export const truncate = `
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
export const cursor_pointer = `
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
  return `
    border-width: ${px(n)};
    border-style: solid;
  `;
}
function make_rounded(n) {
  return `
    border-radius: ${px(n)};
  `;
}
function make_z(n) {
  return `
    z-index: ${n};
  `;
}
