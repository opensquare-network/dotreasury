function getFinderFromMeta(meta) {
  if (meta.finder && typeof meta.finder === 'string') {
    return meta.finder;
  }

  if (meta.finder && Array.isArray(meta.finder)) {
    return meta.finder[0];
  }

  return meta.tips[0][0]
}

module.exports = {
  getFinderFromMeta,
}
