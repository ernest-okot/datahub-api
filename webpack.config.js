var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
// var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

/* helper function to get into build directory */
var distPath = function ( name ) {
  if ( undefined === name ) {
    return path.join('dist');
  }

  return path.join('dist', name);
};

var webpack_opts = {
  entry: './src/main.ts',
  target: 'node',
  output: {
    filename: distPath('main.js'),
    libraryTarget: "commonjs2"
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      'node_modules',
      'src',
      'src/utils'
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        test: /\.ts$/,
        ts: {
          compiler: 'typescript',
          configFileName: 'tsconfig.json'
        },
        tslint: {
          emitErrors: true,
          failOnHint: true
        }
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.ts$/,
        use: 'awesome-typescript-loader'
      }
      ]
  },
  externals: [nodeExternals()]
};

module.exports = webpack_opts;
