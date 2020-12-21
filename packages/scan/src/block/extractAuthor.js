module.exports = function extractAuthor(sessionValidators, header) {
  const [pitem] = header.digest.logs.filter(
    ({ type }) => type === "PreRuntime"
  );

  const [engine, data] = pitem.asPreRuntime;
  const target = engine.extractAuthor(data, sessionValidators);

  return target.toHex();
};
