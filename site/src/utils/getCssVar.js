export default function getCssVar(property, element) {
  return getComputedStyle(element || document.documentElement)
    .getPropertyValue(property)
    .trim();
}

export function changeColorAlpha(color, alpha) {
  // alpha round 0-1
  alpha = Math.max(0, Math.min(1, alpha));

  //  RGBA format
  if (color.startsWith("rgba(")) {
    return color.replace(
      /rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
      (m, r, g, b) => `rgba(${r.trim()},${g.trim()},${b.trim()},${alpha})`,
    );
  }

  // RGB format
  if (color.startsWith("rgb(")) {
    return color.replace(
      /rgb\(([^,]+),([^,]+),([^)]+)\)/,
      (m, r, g, b) => `rgba(${r.trim()},${g.trim()},${b.trim()},${alpha})`,
    );
  }

  // hexadecimal format
  if (color.startsWith("#")) {
    let hex = color.replace("#", "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((x) => x + x)
        .join("");
    }
    if (hex.length === 6) {
      // Turn to 8-bit hex
      const a = Math.round(alpha * 255)
        .toString(16)
        .padStart(2, "0");
      return `#${hex}${a}`;
    }
    if (hex.length === 4) {
      // #RGBA
      hex = hex
        .split("")
        .map((x) => x + x)
        .join("");
      return `#${hex.substring(0, 6)}${Math.round(alpha * 255)
        .toString(16)
        .padStart(2, "0")}`;
    }
    if (hex.length === 8) {
      // #RRGGBBAA
      return `#${hex.substring(0, 6)}${Math.round(alpha * 255)
        .toString(16)
        .padStart(2, "0")}`;
    }
  }

  // HSLA format
  if (color.startsWith("hsla(")) {
    return color.replace(
      /hsla\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
      (m, h, s, l) => `hsla(${h.trim()},${s.trim()},${l.trim()},${alpha})`,
    );
  }

  // HSL format
  if (color.startsWith("hsl(")) {
    return color.replace(
      /hsl\(([^,]+),([^,]+),([^)]+)\)/,
      (m, h, s, l) => `hsla(${h.trim()},${s.trim()},${l.trim()},${alpha})`,
    );
  }

  // Process the color name（(e.g., red, blue...)
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = color;
  const rgba = ctx.fillStyle;
  // Parse rgba strings
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (match) {
    const [, r, g, b] = match;
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return color;
}
