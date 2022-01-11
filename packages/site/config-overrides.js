module.exports = function override(webpackConfig) {
  webpackConfig.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: "javascript/auto",
  });
  webpackConfig.module.rules.push({
    test: /\.js$/,
    include: /node_modules/,
    loader: require.resolve("@open-wc/webpack-import-meta-loader"),
  });

  return webpackConfig;
};
