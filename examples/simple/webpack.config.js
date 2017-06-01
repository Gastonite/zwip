'use strict';

const Path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');

module.exports = (env) => {

  const isBuild = false;

  const entry = Path.resolve('./src/index.js');

  const output = {
    path: Path.resolve('./build'),
    filename: '[name].js'
  };

  const htmlTemplatePath = Path.resolve('src/index.html');

  const devtool = !isBuild && 'source-map';

  const devServer = {
    port: 3000,
    historyApiFallback: true,
    inline: !isBuild,
    hot: !isBuild,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: true,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m',
      }
    }
  };

  const loaders = [
    {test: /\.js$/, use: 'babel-loader' }
  ];

  const plugins = [new Webpack.NamedModulesPlugin()];

  if (!isBuild)
    plugins.push(new Webpack.HotModuleReplacementPlugin());

  plugins.push(new HTMLWebpackPlugin({
    filename: `index.html`,
    template: htmlTemplatePath,
    cache: true,
    inject: 'body',
    minify: isBuild && {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    },
  }));

  return {
    entry,
    output,
    devtool,
    devServer,
    module: {
      loaders
    },
    plugins
  };

};