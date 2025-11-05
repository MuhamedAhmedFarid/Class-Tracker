module.exports = function (api) {
  api.cache(true);
  return {
    // Keep the original form where `nativewind/babel` is listed as a preset.
    // Some versions of the package export a preset descriptor rather than a
    // plugin, and treating it as a plugin causes the Babel error seen in the
    // bundler: ".plugins is not a valid Plugin property".
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};