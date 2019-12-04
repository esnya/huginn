const { GenerateSW } = require('workbox-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
  pages: {
    index: {
      entry: './src/main.ts',
      template: './src/templates/index.pug',
      favicon: './src/assets/icon.png',
    },
  },
  configureWebpack: {
    plugins: [
      new GenerateSW({
        skipWaiting: process.env.NODE_ENV !== 'production',
      }),
      new FaviconsWebpackPlugin({
        logo: './src/assets/icon.png',
        favicons: {
          lang: 'ja-JP',
          theme_color: '#1976d2',
          orientation: 'portrait',
        },
      }),
    ],
  },
};
