module.exports = {
  componentPaths: ['../../app/components'],
  ignore: ['tests'],
  // Optionally, reuse loaders and plugins from your existing webpack config
  webpackConfigPath: '../webpack/webpack.dev.babel',
  globalImports: [
    'semantic-ui-less/definitions/globals/reset.less',
    'semantic-ui-less/definitions/globals/site.less',
    'semantic-ui-less/semantic.less',
    '../../app/styles/main.less',
    '../../app/styles/cosmos.less',
  ],
  containerQuerySelector: '#app',
};
