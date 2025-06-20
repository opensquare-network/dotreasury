export default function getCssVar(property, element) {
  return getComputedStyle(element || document.documentElement)
    .getPropertyValue(property)
    .trim();
}

export function changeColorAlpha(color, alpha) {
  // alpha 范围限制在 0-1
  alpha = Math.max(0, Math.min(1, alpha));

  // 处理 RGBA 格式
  if (color.startsWith("rgba(")) {
    return color.replace(
      /rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
      (m, r, g, b) => `rgba(${r.trim()},${g.trim()},${b.trim()},${alpha})`,
    );
  }

  // 处理 RGB 格式
  if (color.startsWith("rgb(")) {
    return color.replace(
      /rgb\(([^,]+),([^,]+),([^)]+)\)/,
      (m, r, g, b) => `rgba(${r.trim()},${g.trim()},${b.trim()},${alpha})`,
    );
  }

  // 处理十六进制格式
  if (color.startsWith("#")) {
    let hex = color.replace("#", "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((x) => x + x)
        .join("");
    }
    if (hex.length === 6) {
      // 转为8位hex
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

  // 处理 HSLA 格式
  if (color.startsWith("hsla(")) {
    return color.replace(
      /hsla\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
      (m, h, s, l) => `hsla(${h.trim()},${s.trim()},${l.trim()},${alpha})`,
    );
  }

  // 处理 HSL 格式
  if (color.startsWith("hsl(")) {
    return color.replace(
      /hsl\(([^,]+),([^,]+),([^)]+)\)/,
      (m, h, s, l) => `hsla(${h.trim()},${s.trim()},${l.trim()},${alpha})`,
    );
  }

  // 处理颜色名称（如red, blue等）
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = color;
  const rgba = ctx.fillStyle;
  // 解析rgba字符串
  const match = rgba.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d\.]+))?\)/,
  );
  if (match) {
    const [_, r, g, b] = match;
    return `rgba(${r},${g},${b},${alpha})`;
  }
  // 如果无法识别，直接返回原色值
  return color;
}
