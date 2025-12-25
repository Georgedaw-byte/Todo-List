const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.bundle.js',
  },
  module: {
    rules: [
        {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"]
        },
        {
        test: /\.html$/i,
        loader: "html-loader",
        },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: "./src/template.html"
    })
  ]
};