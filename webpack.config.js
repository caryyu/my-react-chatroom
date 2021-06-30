const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    app: './index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle-all.js',
  },
  module: {
    rules: [
      //{
        //test: /\.css$/,
        //use: ['style-loader','css-loader']
      //},
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }],
              ['@babel/preset-react']
            ]
          }
        }
      }
    ]
  },
};
