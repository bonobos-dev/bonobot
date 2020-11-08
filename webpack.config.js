const path = require('path');
const DIST_PATH = path.resolve(__dirname, './dist');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: DIST_PATH,
    publicPath: '/',
  },
  entry: {
    'mig-app-root': ['./src/public/mig-app-root.ts'],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src/public')],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        threejs: {
          test: /[\\/]node_modules[\\/]((three).*)[\\/]/,
          name: 'threejs',
          chunks: 'all',
        },
      },
    },
  },
  output: {
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: 'src/public/index.html',
      filename: 'index.html',
      inject: true,
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './src/public/assets', to: './assets' }],
    }),
  ],
};

