function getFinderFromMeta(meta) {
  if (meta.finder && typeof meta.finder === 'string') {
    return meta.finder;
  }

  if (meta.finder && Array.isArray(meta.finder)) {
    return meta.finder[0];
  }

  return meta.tips[0][0]
}

function computeTipValue(tipMeta) {
  const tipValues = (tipMeta?.tips ?? []).map((tip) => tip[1]);
  return median(tipValues);
}

function median(values) {
  if (!Array.isArray(values)) {
    return null;
  }

  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

module.exports = {
  getFinderFromMeta,
  computeTipValue,
}
