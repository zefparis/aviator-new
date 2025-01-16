const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    process: require.resolve("process/browser"),
  };

  const fallback = config.resolve.fallback || { fs: false };
  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    path: require.resolve("path-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
    assert: require.resolve("browserify-assets"),
  });
  config.resolve.fallback = fallback;

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);

  return config;
};